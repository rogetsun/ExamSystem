package com.xx.service;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.xx.db.SqlMapFactory;

import java.io.IOException;

/**
 * Created by uv2sun on 15/12/23.
 */
public class DaoService {
    private SqlMapClient sqlMapClient;

    public SqlMapClient getSqlMapClient() {
        return sqlMapClient;
    }

    public void setSqlMapClient(SqlMapClient sqlMapClient) {
        this.sqlMapClient = sqlMapClient;
    }

    public DaoService(SqlMapClient sqlMapClient) {
        this.sqlMapClient = sqlMapClient;
    }

    public DaoService() {
        try {
            this.sqlMapClient = SqlMapFactory.getClient();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
