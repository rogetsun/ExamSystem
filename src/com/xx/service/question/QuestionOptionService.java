package com.xx.service.question;

import com.xx.service.DaoService;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

/**
 * Created by uv2sun on 15/12/23.
 */
@Service
public class QuestionOptionService extends DaoService {


    public List<JSONObject> selectByQuestionID(int qtID) throws SQLException {
        return getSqlMapClient().queryForList("QuestionOption.selectByQuestionID", qtID);
    }

    public List<JSONObject> selectQuestionsOptionsByCourseID(int id) throws SQLException {
        return getSqlMapClient().queryForList("QuestionOption.selectQuestionsOptionsByCourseID", id);
    }

    public int insert(JSONObject opt) throws SQLException {
        return (int) getSqlMapClient().insert("QuestionOption.insert", JSONObject.toBean(opt, HashMap.class));
    }

    public void deleteByQuestionID(int id) throws SQLException {
        getSqlMapClient().delete("QuestionOption.deleteByQuestionID", id);
    }

}
