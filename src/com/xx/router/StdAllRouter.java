package com.xx.router;

import com.uv.utils.Log;
import com.uv.utils.MD5;
import com.xx.service.paper.PaperService;
import com.xx.service.stdall.StdService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Created by uv2sun on 15/12/23.
 * 学生用户全部服务端RESTful
 */
@RestController
public class StdAllRouter {

    @Resource
    private StdService stdService;
    @Resource
    private PaperService paperService;

    /**
     * 获取当前登录学生用户信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/std/current_login", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject currentLogin(HttpServletRequest request) {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        std.put("now", new Date().getTime());
        Log.debug(std);
        return RequestUtil.make_ret(std);
    }

    @RequestMapping(value = "/std/change_password", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject changePassword(HttpServletRequest request, @RequestBody JSONObject stdPwd) throws SQLException {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        stdPwd.put("std_id", std.getInt("std_id"));
        String tp = stdPwd.getString("std_passwd");
        Log.debug(tp);
        tp = MD5.string2md5(tp);
        Log.debug(tp);
        stdPwd.put("std_passwd", tp);
        stdService.changePassword(stdPwd);
        return RequestUtil.make_ret(std);
    }


    /**
     * 查询当前登录学生可以参加的考试
     *
     * @param request
     * @return
     * @throws SQLException
     */
    @RequestMapping(value = "/std/current_exams", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject currentExams(HttpServletRequest request) throws SQLException {
        Object tmp = request.getSession().getAttribute("login_user");
        List<JSONObject> currentExams = null;
        if (null != tmp) {
            JSONObject std = (JSONObject) tmp;
            currentExams = stdService.selectExamsByStdID(std.getInt("std_id"));
        }
        return RequestUtil.make_ret(currentExams);
    }

    @RequestMapping(value = "/std/his_courses", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject hisCourses(HttpServletRequest request) throws SQLException {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        return RequestUtil.make_ret(stdService.selectHisCoursesByStdID(std.getInt("std_id")));
    }

    /**
     * 查询学生某一门课程的考试记录
     *
     * @param request
     * @param cosID
     * @return
     * @throws SQLException
     */
    @RequestMapping(value = "/std/course/{cos_id}/exams", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject courseExams(HttpServletRequest request, @PathVariable("cos_id") int cosID) throws SQLException {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        return RequestUtil.make_ret(stdService.selectStdCourseExams(std.getInt("std_id"), cosID));
    }


    /**
     * 获取考试信息,包括考试,试卷,课程,试题,试题选项信息.
     * 试题和试题选项只有在考试开始后,才会返回.
     *
     * @param request
     * @param examID
     * @return
     * @throws SQLException
     */
    @RequestMapping(value = "/std/exam/{exam_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject exam(HttpServletRequest request, @PathVariable("exam_id") int examID) throws SQLException {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        JSONObject exam = stdService.selectExamByStdIDAndExamID(std.getInt("std_id"), examID);
        int retCode = 0;
        String retMsg = "";
        if (exam != null) {
            long begin = exam.getLong("begin_time");
            int duration = exam.getInt("duration");
            long now = new Date().getTime();
            exam.put("now", now);
            Log.debug("@@@@@@@@@now:" + now);
            Log.debug("@@@@@@@@@begin:" + begin);
            Log.debug("@@@@@@@@@end:" + (begin + (duration * 60 * 1000)));

            if (now > begin - 1000 && now < (begin + (duration * 60 * 1000))) {
                Log.debug("已到开考时间");
                JSONObject stdExam = stdService.selectStdExamByStdIDExamID(std.getInt("std_id"), examID);
                if (stdExam != null && !stdExam.isNullObject()) {
                    retCode = 3;
                    retMsg = "你已交卷";
                    exam = stdExam;
                } else {
                    JSONObject paper = paperService.selectByID(exam.getInt("paper_id"), false);
                    exam.put("paper", paper);
                }
            } else if (now > (begin + (duration * 60 * 1000))) {
                retCode = 2;
                retMsg = "考试已结束";
            }
        } else {
            retCode = 1;
            retMsg = "考试不存在";
        }
        return RequestUtil.make_ret(retCode, retMsg, exam);
    }


    @RequestMapping(value = "/std/exam", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject submitExam(HttpServletRequest request, @RequestBody JSONObject exam) throws SQLException {
        JSONObject std = (JSONObject) request.getSession().getAttribute("login_user");
        JSONObject stdExam = stdService.selectStdExamByStdIDExamID(std.getInt("std_id"), exam.getInt("exam_id"));
        if (null != stdExam && !stdExam.isNullObject()) {
            return RequestUtil.make_ret(1, "你已交卷");
        }
        List<JSONObject> questions = paperService.selectQuestionsRightAnswerByPaperID(exam.getInt("paper_id"));
        JSONObject answer = exam.getJSONObject("answer");
        Log.debug("@@@student right answer:" + answer);
        int score = 0;
        for (Iterator<JSONObject> it = questions.iterator(); it.hasNext(); ) {
            JSONObject q = it.next();
            String qtID = q.getString("qt_id");
            if (answer.has(qtID)) {
                if (q.getInt("is_multi") == 1) {//多选题
                    String ans = answer.getJSONArray(qtID).join(",").replaceAll("\"", "");
                    String rightAns = q.getString("answer");
                    if (rightAns.equals(ans)) {
                        score += q.getInt("score");
                    }
                } else {//单选题
                    String an = answer.getString(qtID);
                    if (an.equals(q.getString("answer"))) {
                        score += q.getInt("score");
                    }
                }
            }
        }
        Log.debug("学生:" + std.getString("std_login") + ",[" + exam.getString("exam_title") + "]成绩:" + score);
        exam.put("score", score);
        exam.put("std_id", std.getInt("std_id"));
        if (exam.getInt("pass_score") <= score) {
            exam.put("is_pass", 1);
        } else {
            exam.put("is_pass", 0);
        }
        stdService.insertStdExam(exam);
        return RequestUtil.make_ret(0, "", score);
    }


}
