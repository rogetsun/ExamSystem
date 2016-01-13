package com.xx.router;

import com.xx.service.exam.ExamService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

/**
 * 考试服务端
 */
@RestController
public class ExamRouter {

    @Resource
    private ExamService examService;

    @RequestMapping(value = "/exams", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject list() throws SQLException {
        List<JSONObject> exams = examService.selectAll();
        long now = new Date().getTime();
        JSONObject examInfo = new JSONObject();
        examInfo.put("exams", exams);
        examInfo.put("now", now);
        return RequestUtil.make_ret(examInfo);
    }

    @RequestMapping(value = "/exams/course/{cos_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listExamsByCourse(@PathVariable("cos_id") int cosID) throws SQLException {
        return RequestUtil.make_ret(examService.selectByCosID(cosID));
    }


    @RequestMapping(value = "/exam", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject add(@RequestBody JSONObject exam) throws SQLException, IOException {
        int examID = examService.insert(exam);
        return RequestUtil.make_ret(0, "", examID);
    }

    @RequestMapping(value = "/exam", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject update(@RequestBody JSONObject exam) throws SQLException, IOException {
        examService.update(exam);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/exam/{exam_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject del(@PathVariable("exam_id") int examID) throws SQLException, IOException {
        examService.deleteByID(examID);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/exam/{exam_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject select(@PathVariable("exam_id") int examID) throws SQLException, IOException {

        return RequestUtil.make_ret(examService.selectByID(examID));
    }

}
