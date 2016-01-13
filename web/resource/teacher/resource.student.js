/**
 * Created by uv2sun on 15/12/23.
 * 学生数据服务
 */
angular.module('resource.student', [])
    .service('studentService', ['$http', function ($http) {

        /**
         * 查询学生信息
         * @param student
         */
        this.select = function (student) {
            if (student) {
                if (student.std_id) {
                    return $http.get('student/' + student.std_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('students').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新学生信息,取决于是否存在std_id
         * @param student
         */
        this.save_or_update = function (student) {
            if (student && student.std_id) {
                return $http.put('student', student).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('student', student).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除学生信息
         * @param student_id
         */
        this.del = function (student_id) {
            if (student_id)
                return $http.delete('student/' + student_id).then(function (res) {
                    return res.data;
                });
        }
    }]);