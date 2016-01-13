package com.xx.service.course;

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
public class CourseService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Course.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Course.selectByID", id);
    }

    public int insertCourse(JSONObject Course) throws SQLException {
        return (int) getSqlMapClient().insert("Course.insert", JSONObject.toBean(Course, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Course.deleteByID", id);
    }

    public void update(JSONObject Course) throws SQLException {
        getSqlMapClient().update("Course.update", JSONObject.toBean(Course, HashMap.class));
    }

    public void deleteMajorCourseRelaByCosID(int cosID) throws SQLException {
        getSqlMapClient().delete("Course.deleteMajorCourseRelaByCosID", cosID);
    }
}
