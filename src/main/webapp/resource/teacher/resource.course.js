/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.course', [])
    .service('courseService', ['$http', function ($http) {

        /**
         * 查询课程信息
         * @param course
         */
        this.select = function (course) {
            if (course) {
                if (course.cos_id) {
                    return $http.get('course/' + course.cos_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('courses').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新课程信息,取决于是否存在course_id
         * @param course
         */
        this.save_or_update = function (course) {
            if (course && course.cos_id) {
                return $http.put('course', course).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('course', course).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除课程信息
         * @param course_id
         */
        this.del = function (course_id) {
            if (course_id)
                return $http.delete('course/' + course_id).then(function (res) {
                    return res.data;
                });
        }
    }]);