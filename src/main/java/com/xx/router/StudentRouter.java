package com.xx.router;

import com.uv.utils.MD5;
import com.xx.service.student.StudentService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 * 学生服务端RESTful
 */
@RestController
public class StudentRouter {

    @Resource
    private StudentService studentService;

    @RequestMapping(value = "/students", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject students() throws SQLException {
        return RequestUtil.make_ret(studentService.selectAll());
    }

    @RequestMapping(value = "/student/passwd", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject changePasswd(@RequestBody JSONObject student) throws SQLException {
        student.put("std_passwd", MD5.string2md5(student.getString("std_passwd")));
        studentService.updatePasswd(student);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/student", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject add(@RequestBody JSONObject student) throws SQLException {
        return RequestUtil.make_ret(0, "", studentService.insert(student));
    }

    @RequestMapping(value = "/student", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject update(@RequestBody JSONObject student) throws SQLException {
        studentService.update(student);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/student/{student_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject del(@PathVariable("student_id") int studentID) throws SQLException {
        studentService.deleteByID(studentID);
        return RequestUtil.make_ret();
    }

}
