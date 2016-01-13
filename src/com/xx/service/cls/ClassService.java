package com.xx.service.cls;

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
public class ClassService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Class.selectAll");
    }

    public JSONObject selectByID(int id) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("Class.selectByID", id);
    }

    public int insert(JSONObject cls) throws SQLException {
        return (int) getSqlMapClient().insert("Class.insert", JSONObject.toBean(cls, HashMap.class));
    }

    public void deleteByID(int id) throws SQLException {
        getSqlMapClient().delete("Class.deleteByID", id);
    }

    public void update(JSONObject cls) throws SQLException {
        getSqlMapClient().update("Class.update", JSONObject.toBean(cls, HashMap.class));
    }


}
