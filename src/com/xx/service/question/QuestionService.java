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
public class QuestionService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Question.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Question.selectByID", id);
    }

    /**
     * 根据课程ID查询考题
     *
     * @param cosID
     * @return
     * @throws SQLException
     */
    public List<JSONObject> selectByCosID(int cosID) throws SQLException {
        return getSqlMapClient().queryForList("Question.selectByCosID", cosID);
    }


    public int insert(JSONObject question) throws SQLException {
        return (int) getSqlMapClient().insert("Question.insert", JSONObject.toBean(question, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Question.deleteByID", id);
    }

    public void update(JSONObject cls) throws SQLException {
        getSqlMapClient().update("Question.update", JSONObject.toBean(cls, HashMap.class));
    }


}
