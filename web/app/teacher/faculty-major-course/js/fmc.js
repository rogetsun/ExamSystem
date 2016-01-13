/**
 * Created by uv2sun on 15/12/23.
 * 院系模块
 */

angular.module('fmc', ['ngDialog', 'ngSanitize', 'ui.select', 'fmc.router', 'fmc.controller', 'resource.faculty', 'resource.major', 'resource.course']);

angular.module('fmc.router', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('fmc', {
                parent: 'index',
                url: '/fmc',
                template: '<ui-view></ui-view>',
                data: {
                    left_states: [
                        {title: '院系管理', state_name: 'fmc.faculty'}
                        , {title: '专业管理', state_name: 'fmc.major'}
                        , {title: '课程管理', state_name: 'fmc.course'}
                    ]
                }
            })
            .state('fmc.faculty', {
                url: '/faculty',
                templateUrl: 'app/teacher/faculty-major-course/template/faculty.html',
                controller: 'facultyController',
                resolve: {
                    facs: ['facultyService', function (facultyService) {
                        return facultyService.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
            .state('fmc.major', {
                url: '/major',
                templateUrl: 'app/teacher/faculty-major-course/template/major.html',
                controller: 'majorController',
                resolve: {
                    facs: ['facultyService', function (facultyService) {
                        return facultyService.select().then(function (res) {
                            return res.data;
                        })
                    }],
                    majors: ['majorService', function (majorService) {
                        return majorService.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
            .state('fmc.course', {
                url: '/course',
                templateUrl: 'app/teacher/faculty-major-course/template/course.html',
                controller: 'courseController',
                resolve: {
                    courses: ['courseService', function (courseService) {
                        return courseService.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
    }]);


angular.module('fmc.controller', [])
    .controller('facultyController', [
        '$scope', '$state', 'ngDialog', 'uvTip', 'uvDialog', 'facs', 'facultyService',
        function ($scope, $state, ngDialog, uvTip, uvDialog, facs, facultyService) {
            /**
             * 全部院系信息
             * @type {facs|*}
             */
            $scope.facs = facs || [];
            /**
             * 修改院系名称
             * @param faculty 院系json
             */
            $scope.modify = function (faculty) {
                open_dialog(faculty.fac_name).then(function (data) {
                    if (!data) return;
                    faculty.fac_name = data.name;
                    facultyService.save_or_update(faculty).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("修改成功", 1000);
                        } else {
                            uvDialog.show("修改失败," + res.ret_msg).then(function () {
                                $state.reload();
                            });
                        }

                    }, function (res) {

                    });
                });
            };
            /**
             * 删除一个院系
             * @param idx 全部院系信息数组$scope.facs下标
             */
            $scope.del = function (faculty) {
                uvDialog.confirm("确定删除院系[" + faculty.fac_name + "]以及院系下的专业?").then(function (ok) {
                    if (ok) {
                        facultyService.del(faculty.fac_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip('删除成功', 1000).then(function () {
                                    $state.reload();
                                });
                            } else {
                                uvTip.showTip('删除失败,' + res.ret_msg);
                            }
                        })
                    }
                })
            };

            /**
             * 添加一个院系
             */
            $scope.add = function () {
                open_dialog().then(function (data) {
                    if (!data) return;
                    var faculty = {fac_name: data.name};
                    facultyService.save_or_update(faculty).then(function (res) {
                        if (res && res.ret_code == 0) {
                            uvTip.showTip("添加成功", 1000).then(function () {
                                $state.reload();
                            });
                        } else {
                            uvDialog.show("添加失败," + res.ret_msg);
                        }
                    });
                });
            };
            /**
             * 交互对话框
             * @param name 院系名称
             * @returns {*}
             */
            var open_dialog = function (name) {
                $scope._name = name;
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input',
                    overlay: true
                }).closePromise.then(function (data) {
                    delete $scope._name;
                    return data.value;
                });
            };

        }
    ])
    .controller('majorController', [
        '$scope', '$timeout', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'majorService', 'facs', 'majors',
        function ($scope, $timeout, $state, uvTip, uvDialog, ngDialog, majorService, facs, majors) {
            $scope.facs = facs;
            $scope.facs_json = {};
            $scope.courses = [];
            angular.forEach($scope.facs, function (v) {
                $scope.facs_json[v.fac_id] = v.fac_name;
            });
            $scope.majors = majors;
            $scope.query = {};
            $scope.is_filter = false;

            $scope.add = function () {
                open_dialog().then(function (data) {
                    if (data) {
                        majorService.save_or_update(data).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("新增专业成功", 1500).then(function () {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip("新增专业失败," + res.ret_msg);
                            }
                        })
                    }

                });
            };

            $scope.modify = function (major) {
                open_dialog(major).then(function (data) {
                    if (data) {
                        majorService.save_or_update(data).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("修改专业成功", 1500).then(function () {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip("修改专业失败," + res.ret_msg);
                            }
                        })
                    }

                })
            };

            $scope.del = function (major) {
                uvDialog.confirm("确定删除[" + major.major_name + "]专业?").then(function (ok) {
                    if (ok) {
                        majorService.del(major.major_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip('删除成功', 1500).then(function (res) {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip('删除失败,' + res.ret_msg);
                            }
                        })
                    }
                })
            };

            $scope.getMajorCourse = function (major) {
                major.show_course = !major.show_course;
                if (major.show_course)
                    majorService.selectCourse(major.major_id).then(function (res) {
                        major.courses = res.data;
                    })
            };

            $scope.addMajorCourse = function (major) {
                majorService.selectCanChooseCourses(major.major_id)
                    .then(function (res) {
                        $scope.courses = res.data;
                        return open_dialog2();
                    })
                    .then(function (data) {
                        if (data) {
                            majorService.addMajorCourse(major.major_id, data.course.cos_id).then(function (res) {
                                if (res && res.ret_code == 0) {
                                    uvTip.showTip("为专业添加课程成功", 1500);
                                    major.courses.push(data.course);
                                } else {
                                    uvTip.showTip("添加失败," + res.ret_msg);
                                }
                            })
                        }
                    });
            };

            $scope.delMajorCourse = function (major, course_idx) {
                uvDialog.confirm("确定删除[" + major.courses[course_idx].cos_name + "]课程?").then(function (ok) {
                    if (ok) {
                        majorService.delMajorCourse(major.major_id, major.courses[course_idx].cos_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("删除成功", 1500);
                                major.courses.splice(course_idx, 1);
                            } else {
                                uvTip.showTip("删除失败," + res.ret_msg);
                            }
                        })
                    }
                })
            };


            $scope.$watch('query', function () {
                $scope.filter = {};
                if ($scope.query.fac_id) {
                    $scope.filter.fac_id = $scope.query.fac_id;
                }
                if ($scope.query.major_name) {
                    $scope.filter.major_name = $scope.query.major_name;
                }
            }, true);

            /**
             * 专业交互对话框
             * @param major
             * @returns {*}
             */
            var open_dialog = function (major) {
                $scope._major = major || {};
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input',
                    overlay: true
                }).closePromise.then(function (data) {
                    delete $scope._major;
                    return data.value;
                });
            };
            /**
             * 课程配置交互对话框
             * @returns {*}
             */
            var open_dialog2 = function () {
                $scope._course = {};
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input2',
                    overlay: true
                }).closePromise.then(function (data) {
                    delete $scope._course;
                    return data.value;
                });
            };
        }
    ])
    .controller('courseController', [
        '$scope', '$timeout', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'courseService', 'courses',
        function ($scope, $timeout, $state, uvTip, uvDialog, ngDialog, courseService, courses) {
            $scope.query = {};
            $scope.courses = courses;

            $scope.add = function () {
                open_dialog().then(function (res) {
                    if (res) {
                        var course = {cos_name: res.cos_name, cos_credit: res.cos_credit};
                        courseService.save_or_update(course).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("新增课程成功", 1500).then(function () {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip("新增课程失败," + res.ret_msg);
                            }
                        })
                    }
                });
            };

            $scope.modify = function (course) {
                open_dialog(course.cos_name, course.cos_credit).then(function (res) {
                    if (res) {
                        course.cos_name = res.cos_name;
                        course.cos_credit = res.cos_credit;
                        courseService.save_or_update(course).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("修改课程成功", 1500).then(function () {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip("修改课程失败," + res.ret_msg);
                            }
                        })
                    }

                })
            };

            $scope.del = function (course) {
                uvDialog.confirm("确定删除[" + course.cos_name + "]课程?").then(function (ok) {
                    if (ok) {
                        courseService.del(course.cos_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip('删除成功', 1500).then(function (res) {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip('删除失败,' + res.ret_msg);
                            }
                        })
                    }
                })
            };

            /**
             * 交互对话框
             * @param cos_name 课程名称
             * @param cos_credit 课程学分
             * @returns {*}
             */
            var open_dialog = function (cos_name, cos_credit) {
                $scope._cos_name = cos_name;
                $scope._cos_credit = cos_credit;
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false,
                    template: 'data-input',
                    overlay: true
                }).closePromise.then(function (data) {
                    delete $scope._cos_name;
                    delete $scope._cos_credit;
                    if (data.value && data.value.cos_credit) {
                        data.value.cos_credit = data.value.cos_credit
                            .replaceAll("。", ".").replaceAll(",", '.').replaceAll("，", '.');
                    }
                    return data.value;
                });
            };
        }
    ]);
