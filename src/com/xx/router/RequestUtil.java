package com.xx.router;

import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by uv2sun on 15/12/20.
 */
public class RequestUtil {
    public static JSONObject getRequestParams(HttpServletRequest request) {
//        return JSONObject.fromObject(request.getParameterMap());
        JSONObject tmpJSON = new JSONObject();
        for (Iterator<Map.Entry<String, String[]>> i = request.getParameterMap().entrySet().iterator(); i.hasNext(); ) {
            Map.Entry<String, String[]> entry = i.next();
            String key = entry.getKey();
            String[] v = entry.getValue();
            tmpJSON.put(key, v.length > 1 ? v : v[0]);
        }
        return tmpJSON;
    }

    public static JSONObject make_ret(int ret_code, String ret_msg, Object data) {
        JSONObject ret = new JSONObject();
        ret.put("ret_code", ret_code);
        ret.put("ret_msg", ret_msg);
        ret.put("data", data);
        return ret;
    }

    public static JSONObject make_ret(int ret_code, String ret_msg) {
        return make_ret(ret_code, ret_msg, null);
    }


    public static JSONObject make_ret(Object data) {
        return make_ret(0, "success", data);
    }

    public static JSONObject make_ret() {
        return make_ret(0, "");
    }
}
