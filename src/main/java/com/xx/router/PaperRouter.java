package com.xx.router;

import com.xx.service.paper.PaperService;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/23.
 * 试卷服务端RESTful
 */
@RestController
public class PaperRouter {

    @Resource
    private PaperService paperService;

    @RequestMapping(value = "/papers", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject list() throws SQLException {
        return RequestUtil.make_ret(paperService.selectAll());
    }

    @RequestMapping(value = "/paper/{paper_id}/questions", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listPaperQuestions(@PathVariable("paper_id") int paperID) throws SQLException {
        return RequestUtil.make_ret(paperService.selectQuestionsByPaperID(paperID));
    }

    @RequestMapping(value = "/paper/{paper_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listPaperAndQuestions(@PathVariable("paper_id") int paperID) throws SQLException {
        try {
            JSONObject tmp = paperService.selectByID(paperID, true);
            return RequestUtil.make_ret(tmp);
        } catch (Exception e) {
            e.printStackTrace();
            return RequestUtil.make_ret(1, e.getMessage());
        }
    }

    @RequestMapping(value = "/papers/course/{cos_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listPapersByCourse(@PathVariable("cos_id") int cosID) throws SQLException {
        return RequestUtil.make_ret(paperService.selectByCosID(cosID));
    }


    @RequestMapping(value = "/paper", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject add(@RequestBody JSONObject paper) throws SQLException, IOException {
        int paperID = paperService.insert(paper);
        return RequestUtil.make_ret(0, "", paperID);
    }

    @RequestMapping(value = "/paper", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject update(@RequestBody JSONObject paper) throws SQLException, IOException {
        paperService.update(paper);
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/paper/{paper_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject del(@PathVariable("paper_id") int paperID) throws SQLException, IOException {
        paperService.deleteByID(paperID);
        return RequestUtil.make_ret();
    }

}
