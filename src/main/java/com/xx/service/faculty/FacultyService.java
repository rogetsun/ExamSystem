package com.xx.service.faculty;

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
public class FacultyService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Faculty.selectAll");
    }

    public int insertFaculty(JSONObject faculty) throws SQLException {
        return (int) getSqlMapClient().insert("Faculty.insert", JSONObject.toBean(faculty, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Faculty.deleteByID", id);
    }

    public void update(JSONObject faculty) throws SQLException {
        getSqlMapClient().update("Faculty.update", JSONObject.toBean(faculty, HashMap.class));
    }

}
