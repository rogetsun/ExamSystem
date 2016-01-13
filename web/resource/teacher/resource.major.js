/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.major', [])
    .service('majorService', ['$http', function ($http) {

        /**
         * 查询专业信息
         * @param major
         */
        this.select = function (major) {
            if (major) {
                if (major.major_id) {
                    return $http.get('major/' + major.major_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('majors').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新专业信息,取决于是否存在major
         * @param major
         */
        this.save_or_update = function (major) {
            if (major && major.major_id) {
                return $http.put('major', major).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('major', major).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除专业信息
         * @param major_id
         */
        this.del = function (major_id) {
            if (major_id)
                return $http.delete('major/' + major_id).then(function (res) {
                    return res.data;
                });
        };

        /**
         * 查询专业下的课程
         * @param major_id
         * @returns {*}
         */
        this.selectCourse = function (major_id) {
            if (major_id) {
                return $http.get('major/' + major_id + '/courses').then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 添加专业课程关系
         * @param major_id
         * @param cos_id
         */
        this.addMajorCourse = function (major_id, cos_id) {
            if (major_id && cos_id) {
                return $http.post("major/" + major_id + "/course/" + cos_id).then(function (res) {
                    return res.data;
                })
            }
        };
        /**
         * 删除专业课程关系
         * @param major_id
         * @param cos_id
         * @returns {*}
         */
        this.delMajorCourse = function (major_id, cos_id) {
            if (major_id && cos_id) {
                return $http.delete("major/" + major_id + "/course/" + cos_id).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 查询专业为分配的课程
         * @param major_id
         * @returns {*}
         */
        this.selectCanChooseCourses = function (major_id) {
            if (major_id) {
                return $http.get('major/' + major_id + '/nocourses').then(function (res) {
                    return res.data;
                });
            }
        }
    }]);