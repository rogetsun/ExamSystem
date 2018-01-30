package com.xx.service.major;

import com.xx.service.DaoService;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by uv2sun on 15/12/23.
 */
@Service
public class MajorService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Major.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Major.selectByID", id);
    }

    public int insertMajor(JSONObject Major) throws SQLException {
        return (int) getSqlMapClient().insert("Major.insert", JSONObject.toBean(Major, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Major.deleteByID", id);
    }

    public void update(JSONObject Major) throws SQLException {
        getSqlMapClient().update("Major.update", JSONObject.toBean(Major, HashMap.class));
    }

    public void deleteByFacID(int facID) throws SQLException {
        getSqlMapClient().delete("Major.deleteByFacID", facID);
    }

    public List<JSONObject> selectCourse(int majorID) throws SQLException {
        return getSqlMapClient().queryForList("Major.selectMajorCourse", majorID);
    }

    public void insertMajorCourse(int majorID, int cosID) throws SQLException {
        Map<String, Object> tmp = new HashMap<>();
        tmp.put("major_id", majorID);
        tmp.put("cos_id", cosID);
        getSqlMapClient().insert("Major.insertMajorCourse", tmp);
    }

    public void deleteMajorCourse(int majorID, int cosID) throws SQLException {
        Map<String, Object> tmp = new HashMap<>();
        tmp.put("major_id", majorID);
        tmp.put("cos_id", cosID);
        getSqlMapClient().insert("Major.deleteMajorCourse", tmp);
    }

    public List<JSONObject> selectMajorNoCourses(int majorID) throws SQLException {
        return getSqlMapClient().queryForList("Major.selectMajorNoCourses", majorID);
    }

    public void deleteMajorCourses(int majorID) throws SQLException {
        getSqlMapClient().delete("Major.deleteMajorCourses", majorID);
    }
}
