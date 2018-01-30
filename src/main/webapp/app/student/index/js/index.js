/**
 * Created by uv2sun on 15/12/15.
 * teacher主APP
 */

angular.module(
    'student-app',
    [
        'ui.router', 'ngDialog', 'util.httpInterceptor', 'uv.service.loading', 'uv.service.dialog', 'uv.service.tip'
        , 'resource.student-all', 'student-all.controller'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'uvLoadingProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, uvLoadingProvider, $locationProvider) {
            uvLoadingProvider.setLoadingGif('assets/diy/uv-loading/loading.gif');
            // $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("/index/main");
            $stateProvider
                .state('index', {
                    url: '/index',
                    abstract: true,
                    template: '<ui-view></ui-view>'
                })
                .state('index.main', {
                    url: '/main',
                    templateUrl: 'app/student/index/template/index.html',
                    controller: 'studentIndexController'
                })
                .state('index.exam', {
                    url: '/exam/{exam_id}',
                    templateUrl: 'app/student/index/template/exam.html',
                    controller: 'studentExamController'
                })
            ;
        }])
    .run(['$rootScope', '$timeout', 'stdAllService', function ($rootScope, $timeout, stdAllService) {

    }]);
angular.module('student-all.controller', ['uv.directive.clock', 'uv.filter'])
    .controller('studentIndexController', [
        '$scope', '$timeout', 'ngDialog', 'uvDialog', 'stdAllService',
        function ($scope, $timeout, ngDialog, uvDialog, stdAllService) {
            /**
             * 初始化数据
             */
            /**
             * 当前登录用户,时间查询
             */
            stdAllService.getLoginStd().then(function (res) {
                $scope.login_user = res.data;
                $scope.now = res.data.now;
                var timer = function () {
                    $scope.now += 1000;
                    $timeout(timer, 1000);
                };
                timer();
            });
            //可参加考试获取
            stdAllService.getCurrentExams().then(function (res) {
                $scope.exams = res.data;
            });

            //历史考试课程分数
            stdAllService.getHisCourseScore().then(function (res) {
                $scope.his_courses = res.data;
            });

            $scope.showCourseExamHis = function (c) {
                uvDialog.showTemplate("exam_his_dialog", $scope, {_course: c}, ['$scope', 'stdAllService', function ($scope, stdAllService) {
                    stdAllService.selectCourseExamHis(c.cos_id).then(function (res) {
                        $scope._course.exams = res.data;
                    })
                }])
            };
            /**
             * 学生个人操作代码
             */
                //退出
            $scope.logout = function () {
                window.location = "logout";
            };

            $scope.modify_password = function () {
                $scope.user = $scope.login_user;
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'change_password_dialog',
                    overlay: true,
                    controller: ['$scope', function ($scope) {
                        $scope.valid = {};
                        $scope.change_password = function () {
                            var user = {
                                old_password: $scope.old_password,
                                new_password: $scope.new_password,
                                new_password_repeat: $scope.new_password_repeat
                            };
                            console.log(user);
                            if ($scope.valid_old()) {
                                $scope.valid = {};
                                if (!user.new_password) {
                                    $scope.valid.new_password = '请输入新密码';
                                    return false;
                                } else if (user.new_password != user.new_password_repeat) {
                                    $scope.valid.new_password_repeat = '两次输入的新密码不一致';
                                    return false;
                                }
                                user.std_passwd = md5(user.new_password);
                                stdAllService.changePassword(user).then(function (res) {
                                    if (res && res.ret_code == '0') {
                                        uvDialog.show('修改成功,请重新登录').then(function () {
                                            window.location = "logout";
                                        });
                                    }
                                    else {
                                        uvDialog.show('[' + res.ret_code + '],' + res.ret_msg);
                                    }
                                })
                            } else {
                                return false;
                            }
                        };
                        $scope.valid_old = function () {
                            $scope.valid = {};
                            if (!$scope.old_password) {
                                $scope.valid.old_password = '请输入当前密码';
                                return false;
                            } else {
                                var passwd = $scope.user.std_passwd;
                                console.log('real passwd:%s', passwd);
                                var old_passwd = md5(md5($scope.old_password));
                                console.log('old passwd:%s', old_passwd);
                                if (old_passwd != passwd) {
                                    $scope.valid.old_password = '当前密码错误';
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }]
                }).closePromise
                    .then(function (data) {

                    });
            };

        }
    ])
    .controller('studentExamController', [
        '$scope', '$timeout', '$state', '$stateParams', '$filter', 'ngDialog', 'uvDialog', 'stdAllService',
        function ($scope, $timeout, $state, $stateParams, $filter, ngDialog, uvDialog, stdAllService) {
            console.log('studentExamController');
            /**
             * 初始化数据
             */
            /**
             * 当前登录用户,时间查询
             */
            stdAllService.getLoginStd().then(function (res) {
                $scope.login_user = res.data;
            });
            //考试未开始,等待标志位
            $scope.wait_flag = true;
            if ($stateParams.exam_id) {
                stdAllService.getExam($stateParams.exam_id).then(function (res) {
                    if (res && res.ret_code == 0) {
                        var exam = $scope.exam = res.data;
                        console.log(exam);
                        $scope.last_seconds = parseInt((exam.begin_time - exam.now) / 1000);
                        if ($scope.last_seconds < 0) {
                            $scope.last_seconds = 0;
                            $scope.wait_flag = false;
                            setLeftSeconds();
                        }
                        console.log("last_seconds=" + $scope.last_seconds);
                    } else {
                        $scope.wait_flag = false;
                        uvDialog.show(res.ret_msg).then(function () {
                            $state.go('index.main');
                        });
                    }
                });
            } else {
                $state.go('index.main');
            }

            $scope.timeout = function () {
                $timeout(function () {
                    stdAllService.getExam($stateParams.exam_id).then(function (res) {
                        $scope.exam = res.data;
                        setLeftSeconds();
                        $scope.wait_flag = false;
                    });
                }, 1000);
            };
            var setLeftSeconds = function () {
                $scope.left_seconds = parseInt($scope.exam.begin_time) + ($scope.exam.duration * 60 * 1000) - $scope.exam.now;
                var count = function () {
                    $scope.left_seconds -= 1000;
                    if ($scope.left_seconds <= 0) {
                        $scope.submitExam();
                    } else {
                        $timeout(count, 1000);
                    }
                };
                count();
            };

            /**
             * 选中选项事件
             * @param question
             * @param opt
             */
            $scope.selectOpt = function (question, opt) {
                if (question.is_multi == '1') {
                    opt.selected = opt.selected == 1 ? 0 : 1;
                    var selectedOpts = $filter('filter')(question.options, {selected: 1});
                    question.answer = [];
                    angular.forEach(selectedOpts, function (v) {
                        this.push(v.opt_title);
                    }, question.answer);
                } else {
                    angular.forEach(question.options, function (v) {
                        v.selected = 0;
                    });
                    opt.selected = 1;
                    question.answer = opt.opt_title;
                }
                //$scope.result[question.qt_id] = opt;
            };

            /**
             * 确定交卷
             */
            $scope.confirmExam = function () {
                uvDialog.confirm("确定交卷么?").then(function (res) {
                    if (res) {
                        $scope.submitExam();
                    }
                })
            };
            /**
             * 交卷
             */
            $scope.submitExam = function () {
                var answer = {};
                angular.forEach($scope.exam.paper.questions, function (q) {
                    this[q.qt_id] = q.answer;
                }, answer);
                console.log(answer);
                $scope.exam.answer = answer;
                stdAllService.submitExam($scope.exam).then(function (res) {
                    if (res && res.ret_code == 0) {
                        uvDialog.show('考试完毕,你的成绩是:' + res.data).then(function () {
                            $state.go('index.main');
                        })
                    } else {
                        uvTip.showTip("交卷失败," + res.ret_msg);
                    }
                });
            };

        }
    ])
;

angular.module('uv.filter', [])
    .filter('timer', [function () {
        return function (time) {
            if (time) {
                var s = parseInt(time / 1000);
                var m = parseInt(s / 60);
                var h = parseInt(m / 60);
                m = m % 60;
                s = s % 60;
                h = h > 9 ? h : '0' + h;
                s = s > 9 ? s : '0' + s;
                m = m > 9 ? m : '0' + m;
                return h + ":" + m + ":" + s;
            } else {
                return "00:00:00";
            }
        }
    }]);