package com.xx.router;

import com.xx.service.course.CourseService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 * 课程服务端RESTful
 */
@RestController
public class CourseRouter {

    @Resource
    private CourseService courseService;

    @RequestMapping(value = "/courses", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject courses() throws SQLException {
        return RequestUtil.make_ret(courseService.selectAll());
    }

    @RequestMapping(value = "/course", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addCourse(@RequestBody JSONObject course) throws SQLException {
        return RequestUtil.make_ret(0, "", courseService.insertCourse(course));
    }

    @RequestMapping(value = "/course", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject updateCourse(@RequestBody JSONObject course) throws SQLException {
        courseService.update(course);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/course/{course_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject delCourse(@PathVariable("course_id") int courseID) throws SQLException {
        courseService.deleteByID(courseID);
        courseService.deleteMajorCourseRelaByCosID(courseID);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/course/{course_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getCourseByID(@PathVariable("course_id") int courseID) throws SQLException {
        return RequestUtil.make_ret(courseService.selectByID(courseID));
    }


}
