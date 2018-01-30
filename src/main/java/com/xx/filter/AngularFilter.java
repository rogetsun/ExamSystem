package com.xx.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by uv2sun on 15/12/22.
 */

public class AngularFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        /**
         * 过滤angular使用html5mode的url时,没有#号导致请求发送到后台,需要重定向到带#的url
         */
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String uri = request.getRequestURI();
        System.out.println("uri:" + uri);
        String redirectUrl = uri.replaceFirst("/index", "#/index");
        System.out.println("redirect:" + redirectUrl);
        HttpServletResponse response = (HttpServletResponse) servletResponse;
//        filterChain.doFilter(servletRequest, servletResponse);
        response.sendRedirect(redirectUrl);
    }

    @Override
    public void destroy() {

    }
}
