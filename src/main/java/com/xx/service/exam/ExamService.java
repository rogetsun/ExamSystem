package com.xx.service.exam;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.xx.service.DaoService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

/**
 * Created by uv2sun on 16/01/03.
 */
@Service
public class ExamService extends DaoService {

    public List<JSONObject> selectAll() throws SQLException {
        return getSqlMapClient().queryForList("Exam.selectAll");
    }

    /**
     * 查询指定考试
     *
     * @param id
     * @return
     * @throws SQLException
     */
    public JSONObject selectByID(int id) throws SQLException {
        JSONObject exam = (JSONObject) getSqlMapClient().queryForObject("Exam.selectByID", id);
        List<JSONObject> classes = getSqlMapClient().queryForList("ExamPublish.selectByExamID", id);
        exam.put("classes", classes);
        return exam;
    }

    /**
     * 根据课程ID查询考试
     *
     * @param cosID
     * @return
     * @throws SQLException
     */
    public List<JSONObject> selectByCosID(int cosID) throws SQLException {
        return getSqlMapClient().queryForList("Exam.selectByCosID", cosID);
    }


    /**
     * 插入发布的考试
     *
     * @param Exam
     * @return
     * @throws SQLException
     */
    public int insert(JSONObject Exam) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            int ExamID = (int) client.insert("Exam.insert", JSONObject.toBean(Exam, HashMap.class));
            JSONArray classes = Exam.getJSONArray("classes");
            insertExamPublish(client, ExamID, classes);
            client.commitTransaction();
            return ExamID;
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    public void deleteByID(int id) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            client.delete("Exam.deleteByID", id);
            client.delete("ExamPublish.deleteByExamID", id);
            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    public void update(JSONObject exam) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        client.startTransaction();
        try {
            int examID = exam.getInt("exam_id");
            client.update("Exam.update", JSONObject.toBean(exam, HashMap.class));
            JSONArray classes = exam.getJSONArray("classes");
            if (classes != null && !classes.isEmpty()) {
                client.delete("ExamPublish.deleteByExamID", examID);
                insertExamPublish(client, examID, classes);
            }
            client.commitTransaction();
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    /**
     * insert into exam_class
     *
     * @param client
     * @param examID
     * @param classes
     * @throws SQLException
     */
    private void insertExamPublish(SqlMapClient client, int examID, JSONArray classes) throws SQLException {
        if (classes != null && classes.size() > 0) {
            for (int i = 0; i < classes.size(); i++) {
                JSONObject ExamPublish = classes.getJSONObject(i);
                ExamPublish.put("exam_id", examID);
                client.insert("ExamPublish.insert", JSONObject.toBean(ExamPublish, HashMap.class));
            }
        }
    }


}
