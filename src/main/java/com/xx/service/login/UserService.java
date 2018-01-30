package com.xx.service.login;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.xx.db.SqlMapFactory;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Created by uv2sun on 15/12/20.
 */
@Service
public class UserService {

    private SqlMapClient sqlMapClient;


    public JSONObject selectTeacherByLogin(String login) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("User.selectTeacherByLogin", login);
    }

    public JSONObject selectStudentByLogin(String login) throws SQLException {
        return (JSONObject) getSqlMapClient().queryForObject("User.selectStudentByLogin", login);
    }


    public UserService(SqlMapClient sqlMapClient) {
        this.sqlMapClient = sqlMapClient;
    }

    public UserService() throws IOException {
        this.sqlMapClient = SqlMapFactory.getClient();
    }

    public void setSqlMapClient(SqlMapClient sqlMapClient) {
        this.sqlMapClient = sqlMapClient;
    }

    public SqlMapClient getSqlMapClient() {

        return sqlMapClient;
    }

}
