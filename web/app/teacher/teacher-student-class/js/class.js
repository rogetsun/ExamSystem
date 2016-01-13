/**
 * Created by uv2sun on 15/12/25.
 * 班级router app
 */
angular.module('class',
    [
        'ui.router', 'resource.class', 'resource.major', 'class.router', 'class.controller'
    ]);


angular.module('class.router', []).config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider.state('tsc.class', {
            url: '/class',
            templateUrl: 'app/teacher/teacher-student-class/template/class.html',
            controller: 'classController',
            resolve: {
                majors: ['majorService', function (majorService) {
                    return majorService.select().then(function (res) {
                        return res.data;
                    })
                }],
                classes: ['classService', function (classService) {
                    return classService.select().then(function (res) {
                        return res.data;
                    })
                }]
            }
        });
    }]);

angular.module('class.controller', []).controller('classController', [
    '$scope', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'classService', 'classes', 'majors',
    function ($scope, $state, uvTip, uvDialog, ngDialog, classService, classes, majors) {
        $scope.classes = classes;
        $scope.majors = majors;
        $scope.major_json = {};
        angular.forEach(majors, function (v) {
            this[v.major_id] = v;
        }, $scope.major_json);

        $scope.del = function (cls) {
            uvDialog.confirm('确定删除班级[' + cls.cls_no + '](不会删除班级下的学生)?').then(function (ok) {
                if (ok) {
                    classService.del(cls.cls_id).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("删除成功", 1500);
                            $state.reload();
                        } else {
                            uvTip.showTip("删除失败," + res.ret_msg);
                        }
                    })
                }
            })
        };

        $scope.add = function () {
            open_dialog().then(function (data) {
                if (data) {
                    classService.save_or_update(data).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("新增成功", 1500);
                            $state.reload();
                        } else {
                            uvTip.showTip("新增班级失败," + res.ret_code);
                        }
                    })
                }
            })
        };

        $scope.modify = function (cls) {
            open_dialog(cls).then(function (data) {
                if (data) {
                    classService.save_or_update(data).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("修改成功", 1500);
                            $state.reload();
                        } else {
                            uvTip.showTip("修改班级失败," + res.ret_code);
                        }
                    })
                }
            })
        };
        /**
         * 交互对话框
         * @param cls 班级
         * @returns {*}
         */
        var open_dialog = function (cls) {
            if (cls) {
                cls.major = $scope.major_json[cls.major_id];
                $scope._class = angular.copy(cls);
            } else {
                $scope._class = {};
            }

            return ngDialog.open({
                scope: $scope, closeByDocument: false, showClose: false,
                template: 'data-input',
                overlay: true
            }).closePromise.then(function (data) {
                delete $scope._class;
                data.value.major_id = data.value.major.major_id;
                return data.value;
            });
        };
    }
]);