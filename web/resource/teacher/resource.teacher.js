/**
 * Created by uv2sun on 15/12/23.
 * 教师数据服务
 */
angular.module('resource.teacher', [])
    .service('teacherService', ['$http', function ($http) {

        /**
         * 查询教师信息
         * @param teacher
         */
        this.select = function (teacher) {
            if (teacher) {
                if (teacher.tch_id) {
                    return $http.get('teacher/' + teacher.tch_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('teachers').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 查询当前登陆教师
         * @returns {*}
         */
        this.select_login_teacher = function () {
            return $http.get('current_login').then(function (res) {
                return res.data;
            });
        };

        /**
         * 保存或更新教师信息,取决于是否存在tch_id
         * @param teacher
         */
        this.save_or_update = function (teacher) {
            if (teacher && teacher.tch_id) {
                return $http.put('teacher', teacher).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('teacher', teacher).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 修改teacher密码
         * @param teacher
         * @returns {*}
         */
        this.changePassword = function (teacher) {
            return $http.put('teacher/password', teacher).then(function (res) {
                return res.data;
            })
        };

        /**
         * 删除教师信息
         * @param teacher_id
         */
        this.del = function (teacher_id) {
            if (teacher_id)
                return $http.delete('teacher/' + teacher_id).then(function (res) {
                    return res.data;
                });
        }
    }]);