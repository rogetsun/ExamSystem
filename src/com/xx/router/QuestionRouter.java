package com.xx.router;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.uv.utils.Log;
import com.xx.db.SqlMapFactory;
import com.xx.service.question.QuestionOptionService;
import com.xx.service.question.QuestionService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

/**
 * Created by uv2sun on 15/12/23.
 * 考题服务端RESTful
 */
@RestController
public class QuestionRouter {

    @Resource
    private QuestionService questionService;

    @Resource
    private QuestionOptionService optionService;

    @RequestMapping(value = "/questions", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject list() throws SQLException {
        return RequestUtil.make_ret(questionService.selectAll());
    }

    @RequestMapping(value = "/question/{question_id}/options", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listOptions(@PathVariable("question_id") int questionID) throws SQLException {
        return RequestUtil.make_ret(optionService.selectByQuestionID(questionID));
    }

    @RequestMapping(value = "/questions/course/{cos_id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject listQuestionByCourse(@PathVariable("cos_id") int cosID) throws SQLException {
//        return RequestUtil.make_ret(questionService.selectByCosID(cosID));
        JSONArray questions = new JSONArray();
        List<JSONObject> questionsOptions = optionService.selectQuestionsOptionsByCourseID(cosID);
        JSONObject question = null;
        for (Iterator<JSONObject> i = questionsOptions.iterator(); i.hasNext(); ) {
            JSONObject tmp = i.next();
            if (question == null || question.getInt("qt_id") != tmp.getInt("qt_id")) {
                if (question != null) questions.add(question);
                question = new JSONObject();
                question.put("qt_id", tmp.get("qt_id"));
                question.put("qt_content", tmp.get("qt_content"));
                question.put("cos_id", tmp.get("cos_id"));
                question.put("is_multi", tmp.get("is_multi"));
                question.put("options", new JSONArray());
            }
            JSONObject option = new JSONObject();
            option.element("opt_id", tmp.get("opt_id"));
            option.element("opt_title", tmp.get("opt_title"));
            option.element("opt_content", tmp.get("opt_content"));
            option.element("is_right", tmp.get("is_right"));
            question.accumulate("options", option);
        }
        if (question != null) questions.add(question);
        Log.debug(questions);
        return RequestUtil.make_ret(questions);
    }


    @RequestMapping(value = "/question", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject add(@RequestBody JSONObject question) throws SQLException, IOException {
        SqlMapClient client = SqlMapFactory.beginTransaction();
        questionService.setSqlMapClient(client);
        int qtID = questionService.insert(question);
        JSONArray options = question.getJSONArray("options");
        if (options != null && options.size() > 0) {
            optionService.setSqlMapClient(client);
            for (int i = 0; i < options.size(); i++) {
                JSONObject option = options.getJSONObject(i);
                option.put("qt_id", qtID);
                optionService.insert(option);
            }
        }
        client.commitTransaction();
        client.endTransaction();
        return RequestUtil.make_ret(0, "");

    }

    @RequestMapping(value = "/question", method = RequestMethod.PUT)
    @ResponseBody
    public JSONObject update(@RequestBody JSONObject question) throws SQLException, IOException {
        SqlMapClient client = SqlMapFactory.beginTransaction();
        questionService.setSqlMapClient(client);
        optionService.setSqlMapClient(client);
        questionService.update(question);
        JSONArray options = question.getJSONArray("options");
        if (options != null && options.size() > 0) {
            int qtId = question.getInt("qt_id");
            optionService.deleteByQuestionID(qtId);
            for (int i = 0; i < options.size(); i++) {
                JSONObject option = options.getJSONObject(i);
                option.put("qt_id", qtId);
                optionService.insert(option);
            }
        }
        client.commitTransaction();
        client.endTransaction();
        return RequestUtil.make_ret();
    }

    @RequestMapping(value = "/question/{question_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public JSONObject del(@PathVariable("question_id") int questionID) throws SQLException, IOException {
        SqlMapClient client = SqlMapFactory.beginTransaction();
        questionService.setSqlMapClient(client);
        optionService.setSqlMapClient(client);
        optionService.deleteByQuestionID(questionID);
        questionService.deleteByID(questionID);
        client.commitTransaction();
        client.endTransaction();
        return RequestUtil.make_ret();
    }

}
