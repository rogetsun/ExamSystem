/**
 * Created by uv2sun on 15/12/28.
 * 考试数据服务
 */
angular.module('resource.exam', [])
    .service('examService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询考试信息
         * @param exam
         */
        this.select = function (exam) {
            if (exam) {
                if (exam.exam_id) {
                    return $http.get('exam/' + exam.exam_id).then(function (res) {
                        return res.data;
                    });
                } else if (exam.cos_id) {
                    return $http.get('exams/course/' + exam.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('exams').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据考试ID查询参加考试班级
         * @param exam_id 考试ID
         * @returns {*}
         */
        this.select_classes = function (exam_id) {
            if (exam_id) {
                return $http.get("exam/" + exam_id + "/classes").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新考试信息,取决于是否存在exam_id
         * @param exam
         */
        this.save_or_update = function (exam) {
            if (exam && exam.exam_id) {
                return $http.put('exam', exam).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('exam', exam).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除考试信息
         * @param exam_id
         */
        this.del = function (exam_id) {
            if (exam_id)
                return $http.delete('exam/' + exam_id).then(function (res) {
                    return res.data;
                });
        }
    }]);