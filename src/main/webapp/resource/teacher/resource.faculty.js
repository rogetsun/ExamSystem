/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.faculty', [])
    .service('facultyService', ['$http', function ($http) {

        /**
         * 查询院系信息
         * @param fac
         */
        this.select = function (fac) {
            if (fac) {
                if (fac.fac_id) {
                    return $http.get('faculty/' + fac.fac_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('faculties').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新院系信息,取决于是否存在fac_id
         * @param fac
         */
        this.save_or_update = function (fac) {
            if (fac && fac.fac_id) {
                return $http.put('faculty', fac).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('faculty', fac).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除院系信息
         * @param fac_id
         */
        this.del = function (fac_id) {
            if (fac_id)
                return $http.delete('faculty/' + fac_id).then(function (res) {
                    return res.data;
                });
        }
    }]);