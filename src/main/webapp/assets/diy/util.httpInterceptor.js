/**
 * Created by uv2sun on 15/7/16.
 * angular $http拦截处理器
 */
angular.module('util.httpInterceptor', [])
    .factory('myHttpInterceptor', ['$q', '$window', 'uvLoading', 'uvTip', function ($q, $window, uvLoading, uvTip) {
        return {
            // optional method
            'request': function (config) {
                uvLoading.loading();
                return config;
            },

            'response': function (response) {
                uvLoading.unloading();
                return response;
            },
            'responseError': function (response) {
                if (response.status === 401) {
                    //TODO 转到登录页面
                    uvTip.showTip('请重新登陆', 3000).then(function () {
                        window.location.href = "login";
                    });
                } else if (response.status == 403) {
                    console.log(response.data);
                } else if (response.status == 500) {
                    uvTip.showTip(response.data);
                } else {

                }
                uvLoading.unloading();
                console.log(response);
                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }]);