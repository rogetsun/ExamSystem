package com.xx.service.teacher;

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
public class TeacherService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Teacher.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Teacher.selectByID", id);
    }

    public int insertTeacher(JSONObject Teacher) throws SQLException {
        return (int) getSqlMapClient().insert("Teacher.insert", JSONObject.toBean(Teacher, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Teacher.deleteByID", id);
    }

    public void update(JSONObject Teacher) throws SQLException {
        getSqlMapClient().update("Teacher.update", JSONObject.toBean(Teacher, HashMap.class));
    }

    public void updatePasswd(JSONObject teacher) throws SQLException {
        getSqlMapClient().update("Teacher.updatePassword", JSONObject.toBean(teacher, HashMap.class));
    }

}
