package com.xx.router;

import com.uv.utils.Log;
import com.xx.service.major.MajorService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 */
@RestController
public class MajorRouter {

    @Resource
    private MajorService majorService;

    @RequestMapping(value = "/majors", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject majors() throws SQLException {
        return RequestUtil.make_ret(majorService.selectAll());
    }

    @RequestMapping(value = "/major", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addMajor(@RequestBody JSONObject major) throws SQLException {
        Log.debug("新增专业:" + major);
        return RequestUtil.make_ret(0, "", majorService.insertMajor(major));
    }

    @RequestMapping(value = "/major", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject updateMajor(@RequestBody JSONObject major) throws SQLException {
        majorService.update(major);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/major/{major_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject delMajor(@PathVariable("major_id") int majorID) throws SQLException {
        majorService.deleteByID(majorID);
        majorService.deleteMajorCourses(majorID);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/major/{major_id}/courses", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject selectCourse(@PathVariable("major_id") int majorID) throws SQLException {
        return RequestUtil.make_ret(majorService.selectCourse(majorID));
    }

    @RequestMapping(value = "/major/{major_id}/course/{cos_id}", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addMajorCourse(@PathVariable("major_id") int majorID, @PathVariable("cos_id") int cosID) throws SQLException {
        majorService.insertMajorCourse(majorID, cosID);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/major/{major_id}/course/{cos_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject delMajorCourse(@PathVariable("major_id") int majorID, @PathVariable("cos_id") int cosID) throws SQLException {
        majorService.deleteMajorCourse(majorID, cosID);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/major/{major_id}/nocourses", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject selectMajorNoCourses(@PathVariable("major_id") int majorID) throws SQLException {
        return RequestUtil.make_ret(majorService.selectMajorNoCourses(majorID));
    }
}
