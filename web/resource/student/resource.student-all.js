/**
 * Created by uv2sun on 16/1/12.
 * 学生用户登录系统的全部资源
 */

angular.module('resource.student-all', [])
    .service('stdAllService', ['$http', function ($http) {
        /**
         * 获取当前登录学生用户
         * @returns {*}
         */
        this.getLoginStd = function () {
            return $http.get('std/current_login').then(function (res) {
                return res.data;
            })
        };

        this.changePassword = function (std) {
            return $http.put('std/change_password', std).then(function (res) {
                return res.data;
            })
        };

        /**
         * 查询当前登录学生可以参加的考试
         * @returns {*}
         */
        this.getCurrentExams = function () {
            return $http.get('std/current_exams').then(function (res) {
                return res.data;
            })
        };

        /**
         * 查询当前登录学生课程历史考试成绩
         * @returns {*}
         */
        this.getHisCourseScore = function () {
            return $http.get('std/his_courses').then(function (res) {
                return res.data;
            });
        };

        /**
         * 获取考试信息,包括考试,试卷,课程,试题,试题选项信息.
         * 试题和试题选项只有在考试开始后,服务端才会返回.
         * @param exam_id
         * @returns {*}
         */
        this.getExam = function (exam_id) {
            return $http.get('std/exam/' + exam_id).then(function (res) {
                return res.data;
            });
        };


        /**
         * 提交考试
         * @param exam
         * @returns {*}
         */
        this.submitExam = function (exam) {
            return $http.post('std/exam', exam).then(function (res) {
                return res.data;
            });
        };

        this.selectCourseExamHis = function (cos_id) {
            return $http.get('std/course/' + cos_id + '/exams').then(function (res) {
                return res.data;
            })
        }

    }]);