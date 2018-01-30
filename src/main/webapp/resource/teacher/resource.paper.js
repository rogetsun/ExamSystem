/**
 * Created by uv2sun on 15/12/28.
 * 试卷数据服务
 */
angular.module('resource.paper', [])
    .service('paperService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询试卷信息
         * @param paper
         */
        this.select = function (paper) {
            if (paper) {
                if (paper.paper_id) {
                    return $http.get('paper/' + paper.paper_id).then(function (res) {
                        return res.data;
                    });
                } else if (paper.cos_id) {
                    return $http.get('papers/course/' + paper.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('papers').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据试卷ID查询试卷题目
         * @param paper_id 试卷ID
         * @returns {*}
         */
        this.select_questions = function (paper_id) {
            if (paper_id) {
                return $http.get("paper/" + paper_id + "/questions").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新试卷信息,取决于是否存在paper_id
         * @param paper
         */
        this.save_or_update = function (paper) {
            if (paper && paper.paper_id) {
                return $http.put('paper', paper).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('paper', paper).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除试卷信息
         * @param paper_id
         */
        this.del = function (paper_id) {
            if (paper_id)
                return $http.delete('paper/' + paper_id).then(function (res) {
                    return res.data;
                });
        }
    }]);