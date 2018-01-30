package com.xx.router;

import com.xx.service.faculty.FacultyService;
import com.xx.service.major.MajorService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 */
@RestController
public class FacultyRouter {

    @Resource
    private FacultyService facultyService;
    @Resource
    private MajorService majorService;

    @RequestMapping(value = "/faculties", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject faculties() throws SQLException {
        return RequestUtil.make_ret(facultyService.selectAll());
    }

    @RequestMapping(value = "/faculty", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addFaculty(@RequestBody JSONObject faculty) throws SQLException {
        return RequestUtil.make_ret(0, "", facultyService.insertFaculty(faculty));
    }

    @RequestMapping(value = "/faculty", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject updateFaculty(@RequestBody JSONObject faculty) throws SQLException {
        facultyService.update(faculty);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/faculty/{fac_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject delFaculty(@PathVariable("fac_id") int facID) throws SQLException {
        facultyService.deleteByID(facID);
        majorService.deleteByFacID(facID);
        return RequestUtil.make_ret();
    }

}
