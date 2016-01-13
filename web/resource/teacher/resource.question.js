/**
 * Created by uv2sun on 15/12/28.
 * 考题数据服务
 */
angular.module('resource.question', [])
    .service('questionService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询考题信息
         * @param qt
         */
        this.select = function (qt) {
            if (qt) {
                if (qt.qt_id) {
                    return $http.get('question/' + qt.qt_id).then(function (res) {
                        return res.data;
                    });
                } else if (qt.cos_id) {
                    return $http.get('questions/course/' + qt.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('questions').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据题目ID查询选项
         * @param qt_id 题目ID
         * @returns {*}
         */
        this.select_options = function (qt_id) {
            if (qt_id) {
                return $http.get("question/" + qt_id + "/options").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新考题信息,取决于是否存在qt_id
         * @param qt
         */
        this.save_or_update = function (qt) {
            if (qt && qt.qt_id) {
                return $http.put('question', qt).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('question', qt).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除考题信息
         * @param qt_id
         */
        this.del = function (qt_id) {
            if (qt_id)
                return $http.delete('question/' + qt_id).then(function (res) {
                    return res.data;
                });
        }
    }]);