/**
 * Created by uv2sun on 15/12/23.
 * 学生管理模块
 */
angular.module('student', ['student.router', 'student.controller', 'resource.student', 'resource.major', 'resource.class']);

angular.module('student.router', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('tsc.student', {
                url: '/student',
                templateUrl: 'app/teacher/teacher-student-class/template/student.html',
                resolve: {
                    students: ['studentService', function (ts) {
                        return ts.select().then(function (re) {
                            return re.data;
                        })
                    }]
                },
                controller: 'studentController'
            })
    }]);

angular.module('student.controller', [])
    .controller('studentController', [
        '$scope', '$state', 'uvTip', 'ngDialog', 'uvDialog', 'studentService', 'students',
        function ($scope, $state, uvTip, ngDialog, uvDialog, studentService, students) {
            $scope.students = students;

            $scope.add = function () {
                open_dialog().then(function (ok) {
                    if (ok) {
                        $state.reload();
                    }
                });
            };
            $scope.del = function (student) {
                uvDialog.confirm("确定删除[" + student.std_login + "-" + student.std_name + "]学生?").then(function (ok) {
                    if (ok) {
                        studentService.del(student.std_id).then(function (res) {
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

            $scope.modify = function (std) {
                open_dialog(std).then(function (ok) {
                    if (ok) {
                        $state.reload();
                    }
                });
            };
            /**
             * 交互对话框
             * @param student 学生
             * @returns {*}
             */
            var open_dialog = function (student) {
                var _student = {};
                if (student) {
                    _student = angular.copy(student);
                }
                $scope._std = _student;
                //$scope._std = student || {};
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input',
                    overlay: true,
                    controller: 'studentDefController'
                }).closePromise.then(function (data) {
                    delete $scope._std;
                    return data.value;
                });
            };

        }])
    .controller('studentDefController', [
        '$scope', '$filter', 'studentService', 'uvTip',
        function ($scope, $filter, studentService, uvTip) {
            $scope.$watch('_std.in_time', function (nv) {
                var t = $filter('date')(nv, 'yyyy-MM-dd');
                $scope._std.in_time = t;
            });
            $scope.save_or_update = function (student) {
                if (student && student.std_login) {
                    studentService.save_or_update(student).then(function (res) {
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

