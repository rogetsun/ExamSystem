package com.xx.router;

import com.uv.utils.Log;
import com.uv.utils.MD5;
import com.xx.service.teacher.TeacherService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 * 课程服务端RESTful
 */
@RestController
public class TeacherRouter {

    @Resource
    private TeacherService teacherService;

    @RequestMapping(value = "/teachers", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject teachers() throws SQLException {
        return RequestUtil.make_ret(teacherService.selectAll());
    }

    @RequestMapping(value = "/teacher/password", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject changePasswd(@RequestBody JSONObject teacher) throws SQLException {
        teacher.put("tch_passwd", MD5.string2md5(teacher.getString("tch_passwd")));
        teacherService.updatePasswd(teacher);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/teacher", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addTeacher(@RequestBody JSONObject teacher) throws SQLException {
        Log.debug("save Teacher:" + teacher);
        return RequestUtil.make_ret(0, "", teacherService.insertTeacher(teacher));
    }

    @RequestMapping(value = "/teacher", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject updateTeacher(@RequestBody JSONObject teacher) throws SQLException {
        teacherService.update(teacher);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/teacher/{teacher_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject delTeacher(@PathVariable("teacher_id") int teacherID) throws SQLException {
        teacherService.deleteByID(teacherID);
        return RequestUtil.make_ret();
    }


}
