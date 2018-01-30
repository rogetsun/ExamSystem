package com.xx.service.stdall;

import com.ibatis.sqlmap.client.SqlMapClient;
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
public class StdService extends DaoService {

    /**
     * 根据学生ID查询可以参加的考试,即查询发布到学生所在班级,且没有考完的考试
     *
     * @param stdID
     * @return
     * @throws SQLException
     */
    public List<JSONObject> selectExamsByStdID(int stdID) throws SQLException {
        return getSqlMapClient().queryForList("StdAll.selectExamsByStdID", stdID);
    }

    public List<JSONObject> selectHisCoursesByStdID(int stdID) throws SQLException {

        return getSqlMapClient().queryForList("StdAll.selectHisCoursesByStdID", stdID);
    }

    /**
     * 查询学生要参加的考试
     *
     * @param stdID
     * @param examID
     * @return
     * @throws SQLException
     */
    public JSONObject selectExamByStdIDAndExamID(int stdID, int examID) throws SQLException {
        Map<String, Object> tmp = new HashMap<>();
        tmp.put("std_id", stdID);
        tmp.put("exam_id", examID);
        return (JSONObject) getSqlMapClient().queryForObject("StdAll.selectExamByStdIDAndExamID", tmp);
    }

    /**
     * 查询学生某个考试成绩信息
     *
     * @param stdID
     * @param examID
     * @return
     * @throws SQLException
     */
    public JSONObject selectStdExamByStdIDExamID(int stdID, int examID) throws SQLException {
        Map<String, Object> tmp = new HashMap<>();
        tmp.put("std_id", stdID);
        tmp.put("exam_id", examID);
        return (JSONObject) getSqlMapClient().queryForObject("StdAll.selectStdExamByStdIDExamID", tmp);
    }

    public void insertStdExam(JSONObject exam) throws SQLException {
        SqlMapClient client = getSqlMapClient();
        try {
            client.startTransaction();
            client.insert("StdAll.insertStdExam", JSONObject.toBean(exam, HashMap.class));
            JSONObject stdCourseExam = (JSONObject) client.queryForObject("StdAll.selectStdCourseExam", JSONObject.toBean(exam, HashMap.class));
            if (null == stdCourseExam || stdCourseExam.isNullObject()) {
                client.insert("StdAll.insertStdCourseExam", JSONObject.toBean(exam, HashMap.class));
            } else {
                client.update("StdAll.updateStdCourseExam", JSONObject.toBean(exam, HashMap.class));
            }
            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            client.endTransaction();
        }
    }

    public void changePassword(JSONObject stdPwd) throws SQLException {
        getSqlMapClient().update("StdAll.changePassword", JSONObject.toBean(stdPwd, HashMap.class));
    }

    public List<JSONObject> selectStdCourseExams(int stdID, int cosID) throws SQLException {
        Map<String, Object> tmp = new HashMap<>();
        tmp.put("std_id", stdID);
        tmp.put("cos_id", cosID);
        return getSqlMapClient().queryForList("StdAll.selectStdCourseExams", tmp);
    }
}
