package com.xx.service.paper;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.xx.service.DaoService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/**
 * Created by uv2sun on 15/12/23.
 */
@Service
public class PaperService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Paper.selectAll");
    }

    /**
     * 查询指定试卷,包含试卷题目和选项信息
     *
     * @param id
     * @param hasRightOptionFlag
     * @return
     * @throws SQLException
     */
    public JSONObject selectByID(int id, boolean hasRightOptionFlag) throws SQLException {
        JSONObject paper = (JSONObject) getSqlMapClient().queryForObject("Paper.selectByID", id);
        List<JSONObject> paperQuestionsOptions = getSqlMapClient().queryForList("PaperQuestion.selectQuestionsOptionsByPaperID", id);
        JSONArray paperQuestions = new JSONArray();
        JSONObject question = null;
        for (Iterator<JSONObject> i = paperQuestionsOptions.iterator(); i.hasNext(); ) {
            JSONObject tmp = i.next();
            if (question == null || question.getInt("qt_id") != tmp.getInt("qt_id")) {
                if (question != null) paperQuestions.add(question);
                question = new JSONObject();
                question.put("qt_id", tmp.get("qt_id"));
                question.put("score", tmp.get("score"));
                question.put("cos_id", tmp.get("cos_id"));
                question.put("qt_content", tmp.get("qt_content"));
                question.put("is_multi", tmp.get("is_multi"));
                question.put("options", new JSONArray());
            }
            JSONObject option = new JSONObject();
            option.element("opt_id", tmp.get("opt_id"));
            option.element("opt_title", tmp.get("opt_title"));
            option.element("opt_content", tmp.get("opt_content"));
            if (hasRightOptionFlag) option.put("is_right", tmp.get("is_right"));
            question.accumulate("options", option);
        }
        if (question != null) paperQuestions.add(question);
        paper.put("questions", paperQuestions);
        return paper;
    }

    /**
     * 根据课程ID查询试卷
     *
     * @param cosID
     * @return
     * @throws SQLException
     */
    public List<JSONObject> selectByCosID(int cosID) throws SQLException {
        return getSqlMapClient().queryForList("Paper.selectByCosID", cosID);
    }


    public int insert(JSONObject paper) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            int paperID = (int) client.insert("Paper.insert", JSONObject.toBean(paper, HashMap.class));
            JSONArray questions = paper.getJSONArray("questions");
            insertPaperQuestions(client, paperID, questions);
            client.commitTransaction();
            return paperID;
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    public void deleteByID(int id) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            client.delete("Paper.deleteByID", id);
            client.delete("PaperQuestion.deleteByPaperID", id);
            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    public void update(JSONObject paper) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            int paperID = paper.getInt("paper_id");
            client.update("Paper.update", JSONObject.toBean(paper, HashMap.class));
            JSONArray questions = paper.getJSONArray("questions");
            if (questions != null && !questions.isEmpty()) {
                client.delete("PaperQuestion.deleteByPaperID", paperID);
                insertPaperQuestions(client, paperID, questions);
            }
            client.commitTransaction();
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    /**
     * insert into paper_question
     *
     * @param client
     * @param paperID
     * @param questions
     * @throws SQLException
     */
    private void insertPaperQuestions(SqlMapClient client, int paperID, JSONArray questions) throws SQLException {
        if (questions != null && questions.size() > 0) {
            for (int i = 0; i < questions.size(); i++) {
                JSONObject paperQuestion = questions.getJSONObject(i);
                paperQuestion.put("paper_id", paperID);
                client.insert("PaperQuestion.insert", JSONObject.toBean(paperQuestion, HashMap.class));
            }
        }
    }


    /**
     * 查询试卷题目
     *
     * @param paperID 试卷ID
     * @return 题目s
     * @throws SQLException
     */
    public List<JSONObject> selectQuestionsByPaperID(int paperID) throws SQLException {
        return getSqlMapClient().queryForList("PaperQuestion.selectByPaperID", paperID);
    }

    /**
     * 查询问题和问题的正确答案opt_title
     *
     * @param paperID
     * @return
     * @throws SQLException
     */
    public List<JSONObject> selectQuestionsRightAnswerByPaperID(int paperID) throws SQLException {
        return getSqlMapClient().queryForList("PaperQuestion.selectQuestionsRightAnswerByPaperID", paperID);
    }
}
