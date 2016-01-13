/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.class', [])
    .service('classService', ['$http', function ($http) {

        /**
         * 查询班级信息
         * @param cls
         */
        this.select = function (cls) {
            if (cls) {
                if (cls.cls_id) {
                    return $http.get('class/' + cls.cls_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('classes').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新班级信息,取决于是否存在cls_id
         * @param cls
         */
        this.save_or_update = function (cls) {
            if (cls && cls.cls_id) {
                return $http.put('class', cls).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('class', cls).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除班级信息
         * @param cls_id
         */
        this.del = function (cls_id) {
            if (cls_id)
                return $http.delete('class/' + cls_id).then(function (res) {
                    return res.data;
                });
        }
    }]);