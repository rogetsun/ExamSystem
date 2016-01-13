package com.xx.service.student;

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
public class StudentService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Student.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Student.selectByID", id);
    }

    public int insert(JSONObject student) throws SQLException {
        return (int) getSqlMapClient().insert("Student.insert", JSONObject.toBean(student, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Student.deleteByID", id);
    }

    public void update(JSONObject student) throws SQLException {
        getSqlMapClient().update("Student.update", JSONObject.toBean(student, HashMap.class));
    }

    public void updatePasswd(JSONObject Student) throws SQLException {
        getSqlMapClient().update("Student.updatePasswd", Student);
    }

}
