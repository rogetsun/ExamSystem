/**
 * Created by uv2sun on 15/12/23.
 * 教师管理模块
 */
angular.module('teacher', ['teacher.router', 'teacher.controller', 'resource.teacher']);

angular.module('teacher.router', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('tsc.teacher', {
                url: '/teacher',
                templateUrl: 'app/teacher/teacher-student-class/template/teacher.html',
                resolve: {
                    teachers: ['teacherService', function (ts) {
                        return ts.select().then(function (re) {
                            return re.data;
                        })
                    }]
                },
                controller: 'teacherController'
            })
    }]);

angular.module('teacher.controller', [])
    .controller('teacherController', [
        '$scope', '$state', 'uvTip', 'ngDialog', 'uvDialog', 'teacherService', 'teachers',
        function ($scope, $state, uvTip, ngDialog, uvDialog, teacherService, teachers) {
            $scope.teachers = teachers;
            $scope.add = function () {
                open_dialog().then(function (ok) {
                    if (ok) {
                        $state.reload();
                    }
                });
            };
            $scope.del = function (teacher) {
                uvDialog.confirm("确定删除[" + teacher.tch_login + "-" + teacher.tch_name + "]教师?").then(function (ok) {
                    if (ok) {
                        teacherService.del(teacher.tch_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("删除成功");
                                $state.reload();
                            } else {
                                uvTip.showTip('删除失败,' + res.ret_msg);
                            }
                        })
                    }
                })
            };

            $scope.modify = function (tch) {
                open_dialog(tch).then(function (ok) {
                    if (ok) {
                        $state.reload();
                    }
                });
            };
            /**
             * 交互对话框
             * @param teacher 教师
             * @returns {*}
             */
            var open_dialog = function (teacher) {
                var _teacher = {};
                if (teacher) {
                    _teacher = angular.copy(teacher);
                }
                //$scope._tch = _teacher;
                $scope._tch = teacher || {};
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input',
                    overlay: true,
                    controller: 'teacherDefController'
                }).closePromise.then(function (data) {
                    delete $scope._tch;
                    return data.value;
                });
            };

        }])
    .controller('teacherDefController', [
        '$scope', '$filter', 'teacherService', 'uvTip',
        function ($scope, $filter, teacherService, uvTip) {
            $scope.$watch('_tch.in_time', function (nv) {
                var t = $filter('date')(nv, 'yyyy-MM-dd');
                console.log(t);
                $scope._tch.in_time = t;
            });
            $scope.save_or_update = function (teacher) {
                if (teacher && teacher.tch_login) {
                    teacherService.save_or_update(teacher).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("保存成功", 1500);
                            $scope.closeThisDialog(true);
                        } else {
                            uvTip.showTip("保存失败," + res.ret_msg);
                        }
                    })
                }
            };
        }]);

