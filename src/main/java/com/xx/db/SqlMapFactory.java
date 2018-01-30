package com.xx.db;

import com.ibatis.common.resources.Resources;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;

import java.io.IOException;
import java.sql.SQLException;

public class SqlMapFactory {
    private static SqlMapClient client;

    public static SqlMapClient getClient() throws IOException {
        if (null == client) {
            client = SqlMapClientBuilder.buildSqlMapClient(Resources.getResourceAsStream("DBConfig.xml"));
        }
        return client;
    }

    public static void setClient(SqlMapClient client) {
        SqlMapFactory.client = client;
    }

    /**
     * 打开一个事务
     *
     * @return 事务sqlMapClient
     * @throws IOException
     * @throws SQLException
     */
    public static SqlMapClient beginTransaction() throws IOException, SQLException {
        SqlMapClient client = getClient();
        client.startTransaction();
        return client;
    }

    /**
     * 提交事务
     *
     * @param client
     * @throws SQLException
     */
    public static void commit(SqlMapClient client) throws SQLException {
        client.commitTransaction();
    }

    /**
     * 结束事务  finally{} 代码块中使用
     *
     * @param client
     * @throws SQLException
     */
    public static void end(SqlMapClient client) throws SQLException {
        client.endTransaction();
    }

    /**
     * 回滚事务 ibatis 抛出异常后，在finally代码块中调用endTransaction()会自动回滚，so 实现为空
     *
     * @param client
     * @throws SQLException
     */
    public static void rollback(SqlMapClient client) throws SQLException {

    }

    public static void main(String[] args) throws IOException, SQLException {
        System.out.println(SqlMapFactory.getClient());
        System.out.println(SqlMapFactory.getClient());
        System.out.println(SqlMapFactory.beginTransaction());
    }

}
