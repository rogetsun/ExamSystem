package com.xx.router;

import com.xx.service.cls.ClassService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 * 班级服务端RESTful
 */
@RestController
public class ClassRouter {

    @Resource
    private ClassService classService;

    @RequestMapping(value = "/classes", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject list() throws SQLException {
        return RequestUtil.make_ret(classService.selectAll());
    }

    @RequestMapping(value = "/class", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject add(@RequestBody JSONObject cls) throws SQLException {
        return RequestUtil.make_ret(0, "", classService.insert(cls));
    }

    @RequestMapping(value = "/class", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject update(@RequestBody JSONObject cls) throws SQLException {
        classService.update(cls);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/class/{cls_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject del(@PathVariable("cls_id") int clsID) throws SQLException {
        classService.deleteByID(clsID);
        return RequestUtil.make_ret();
    }

}
