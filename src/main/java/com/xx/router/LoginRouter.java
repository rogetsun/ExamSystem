package com.xx.router;

import com.uv.utils.Log;
import com.uv.utils.MD5;
import com.xx.service.login.UserService;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/20.
 * login router
 */
@Controller
public class LoginRouter {

    /**
     * 用户数据服务
     */
    @Resource
    private UserService userService;

    /**
     * 登录界面
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String toLogin(HttpServletRequest request) {
        Object tmp = request.getSession().getAttribute("login_user");
        if (tmp != null) {
            return "redirect:/";
        }
        System.out.println("to login");
        return "WEB-INF/login";
    }

    @RequestMapping(value = "/current_login", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject currentLogin(HttpServletRequest request) {
        Object tmp = request.getSession().getAttribute("login_user");
        Log.debug(tmp);
        return RequestUtil.make_ret(tmp);
    }

    /**
     * 登录ajax校验
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject login(HttpServletRequest request) {
        JSONObject params = RequestUtil.getRequestParams(request);
        Log.debug("params:" + params);
        try {
            /**
             * 先查询学生再查询老师
             */
            JSONObject user = userService.selectStudentByLogin(params.getString("login_no"));
            if (user == null || user.isNullObject()) {
                user = userService.selectTeacherByLogin(params.getString("login_no"));
            }
            if (user == null || user.isNullObject()) {
                return RequestUtil.make_ret(1, "学号/工号不存在");
            } else {
                String passwd = params.getString("login_password");
                if (user.has("std_login")) { // 学生登录
                    if (MD5.string2md5(passwd).equals(user.getString("std_passwd"))) {
                        request.getSession().setAttribute("login_user", user);
                        Log.debug("老师:" + user + "登录");
                        return RequestUtil.make_ret();
                    } else {
                        return RequestUtil.make_ret(2, "密码错误");
                    }
                } else {//老师登录
                    if (MD5.string2md5(passwd).equals(user.getString("tch_passwd"))) {
                        request.getSession().setAttribute("login_user", user);
                        Log.debug("学生:" + user + "登录");
                        return RequestUtil.make_ret();
                    } else {
                        return RequestUtil.make_ret(2, "密码错误");
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return RequestUtil.make_ret(99, e.getMessage());
        }
    }

    /**
     * 主界面
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String toIndex(HttpServletRequest request) {
        Object o = request.getSession().getAttribute("login_user");
        if (o != null) {
            System.out.println("*****已存在登录用户,直接登录[" + o + "]");
            JSONObject jo = (JSONObject) o;
            if (jo.has("tch_id")) {
                return "WEB-INF/t-index";
            } else if (jo.has("std_id")) {
                return "WEB-INF/s-index";
            }
        }
        System.out.println("*****render login.html");
        return "redirect:/login";
    }

//
//    @RequestMapping(value = "/index", method = RequestMethod.GET)
//    public String index(HttpServletRequest request) {
//        Object o = request.getSession().getAttribute("login_user");
//        if (o != null) {
//            System.out.println("*****已存在登录用户,直接登录[" + o + "]");
//            JSONObject jo = (JSONObject) o;
//            if (jo.has("tch_id")) {
//                return "WEB-INF/t-index";
//            } else if (jo.has("std_id")) {
//                return "WEB-INF/s-index";
//            }
//        }
//        System.out.println("*****render login.html");
//        return "redirect:/login";
//    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return "redirect:/login";
    }

}
