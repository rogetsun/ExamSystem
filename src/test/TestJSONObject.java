package test;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.IOException;
import java.util.Date;

/**
 * Created by uv2sun on 15/12/20.
 */
public class TestJSONObject {
    public static void main(String[] args) throws IOException {
        Date d = new Date();
        d.setTime(1451898600000L);
        System.out.println(d);

        JSONObject e = new JSONObject();
        String[] asc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        for (int i = 0; i < 10; i++) {
            e.accumulate("asc", asc[i+1]);
        }
        System.out.println(e);
        JSONArray a = (JSONArray) e.get("asc");
        System.out.println(a);
    }
}
