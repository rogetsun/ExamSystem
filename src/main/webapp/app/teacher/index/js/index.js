/**
 * Created by uv2sun on 15/12/15.
 * teacher主APP
 */

angular.module(
    'teacher-app',
    [
        'ui.router', 'ngDialog', 'util.httpInterceptor', 'uv.service.loading', 'uv.service.dialog', 'uv.service.tip'
        , 'fmc', 'tsc', 'exam'
    ])
    .config(['$urlRouterProvider', '$stateProvider', 'uvLoadingProvider', '$locationProvider',
        function ($urlRouterProvider, $stateProvider, uvLoadingProvider, $locationProvider) {
            console.log("teacher config begin;");
            uvLoadingProvider.setLoadingGif('assets/diy/uv-loading/loading.gif');
            $urlRouterProvider.otherwise("/index");
            //  去掉URL的"#"
            // $locationProvider.html5Mode(true);
            $stateProvider
                .state('index', {
                    url: '/index',
                    data: {
                        nav_funcs: [
                            {title: '考试管理', state_name: 'exam'},
                            {title: '教师班级学生管理', state_name: 'tsc'},
                            {title: '院系专业课程管理', state_name: 'fmc'}
                        ]
                    },
                    views: {
                        'navbar@': {
                            templateUrl: 'app/teacher/index/template/navbar.html',
                            controller: ['$rootScope', '$scope', '$state', 'ngDialog', 'uvDialog', 'teacherService',
                                function ($rootScope, $scope, $state, ngDialog, uvDialog, teacherService) {
                                    $scope.funcs = $state.current.data.nav_funcs;
                                    //退出
                                    $scope.logout = function () {
                                        window.location = "logout";
                                    };
                                    //修改个人信息
                                    $scope.modify_self = function () {
                                        $state.go('user.update', {
                                            login_id: $scope.login_user_id,
                                            next_state: 'index'
                                        })
                                    };

                                    $scope.modify_password = function () {
                                        $scope.user = $scope.login_user;
                                        return ngDialog.open({
                                            scope: $scope, closeByDocument: false, showClose: false,
                                            template: 'change_password_dialog',
                                            overlay: true,
                                            controller: ['$scope', '$q', function ($scope, $q) {
                                                $scope.valid = {};
                                                $scope.change_password = function () {
                                                    var user = {
                                                        tch_id: $scope.user.tch_id
                                                    };
                                                    $scope.valid_old().then(function (res) {
                                                        if (res) {
                                                            $scope.valid = {};
                                                            if (!$scope.new_password) {
                                                                $scope.valid.new_password = '请输入新密码';
                                                                return false;
                                                            } else if ($scope.new_password != $scope.new_password_repeat) {
                                                                $scope.valid.new_password_repeat = '两次输入的新密码不一致';
                                                                return false;
                                                            }
                                                        } else {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).then(function (res) {
                                                        if (res) {
                                                            user.tch_passwd = md5($scope.new_password);
                                                            user.old_password = md5($scope.old_password);
                                                            teacherService.changePassword(user).then(function (res) {
                                                                if (res && res.ret_code == '0') {
                                                                    uvDialog.show('修改成功,请重新登录').then(function () {
                                                                        window.location = "logout";
                                                                    });
                                                                }
                                                                else {
                                                                    uvDialog.show('修改失败[' + res.ret_code + '],' + res.ret_msg);
                                                                }
                                                            })
                                                        }
                                                    })
                                                };

                                                $scope.valid_old = function () {
                                                    var d = $q.defer();
                                                    delete $scope.valid.old_password;
                                                    if (!$scope.old_password) {
                                                        $scope.valid.old_password = '请输入当前密码';
                                                        d.resolve(false);
                                                    } else {
                                                        var now_passwd = md5(md5($scope.old_password));
                                                        if (now_passwd != $scope.user.tch_passwd) {
                                                            d.resolve(false);
                                                            $scope.valid.old_password = '当前密码错误';
                                                        } else {
                                                            d.resolve(true);
                                                        }
                                                    }
                                                    return d.promise;
                                                }
                                            }]
                                        }).closePromise.then(function (data) {

                                        });
                                    };

                                    /**
                                     * navbar.html 跳转state
                                     * @param stateName
                                     */
                                    $scope.changeState = function (stateName) {
                                        $state.go(stateName);
                                    }
                                }
                            ]
                        }
                        , 'left@': {
                            templateUrl: 'app/teacher/index/template/left.html',
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

                            }]
                        }
                        , 'content@': {templateUrl: 'app/teacher/index/template/content.html'}
                    }
                });

            console.log("teacher config over;")
        }])
    .run(['$state', '$rootScope', 'uvLoading', 'teacherService',
        function ($state, $rootScope, uvLoading, teacherService) {
            teacherService.select_login_teacher().then(function (res) {
                console.log(res);
                $rootScope.login_user = res.data;
                $rootScope.login_user_id = res.data.tch_id;
            });
            /**
             * 检测状态改变时,改变rootScope中的current_state_name,
             * 同时判断如果改变大模块,则改变left_states
             */
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeStart:" + fromState + "->" + toState);
                uvLoading.loading();

            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeStart:" + fromState + "->" + toState);
                uvLoading.unloading();
                $rootScope.current_state_name = toState.name;
                var toStateArr = toState.name.split('.');
                console.log('fromState:' + fromState.name + ',toState:' + toState.name + ",toStateArr:" + toStateArr);
                if (fromState.name.split('.')[0] != toStateArr[0]) {
                    $rootScope.left_states = $state.get(toState.name.split('.')[0]).data.left_states;
                    if (toStateArr.length == 1) {
                        console.log('auto transitionTo level2 state:' + $rootScope.left_states[0].state_name);
                        $state.transitionTo($rootScope.left_states[0].state_name);
                        //uvLoading.unloading();
                        return true;
                    }
                }
                if (toStateArr.length >= 2) {
                    var toStateLevel2Name = toStateArr[0] + "." + toStateArr[1];
                    angular.forEach($rootScope.left_states, function (v) {
                        if (v.state_name == toStateLevel2Name) {
                            $rootScope.content_title = v.title;
                        }
                    });
                }
            });
        }]);
