/**
 * Created by uv2sun on 15/12/28.
 * 考试管理,包括题库,试卷,考试发布和统计
 */

angular.module('exam', [
    'exam.router', 'exam.controller',
    'resource.question', 'resource.course', 'resource.paper', 'resource.faculty', 'resource.major', 'resource.exam',
    'uv.fixed'
]);

angular.module('exam.router', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('exam', {
                parent: 'index',
                url: '/exam',
                template: '<ui-view></ui-view>',
                data: {
                    left_states: [
                        {title: '题库管理', state_name: 'exam.question'}
                        , {title: '试卷管理', state_name: 'exam.paper'}
                        , {title: '试卷编辑', state_name: 'exam.paper-def', is_hide: 1}
                        , {title: '发布考试', state_name: 'exam.publish'}
                        , {title: '考试查询', state_name: 'exam.query'}
                    ]
                }
            })
            .state('exam.question', {
                url: '/question',
                templateUrl: 'app/teacher/exam/template/question-container.html',
                controller: 'questionController',
                resolve: {
                    courses: ['courseService', function (cs) {
                        return cs.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
            .state('exam.question.list', {
                url: '/course/{course_id}/list',
                templateUrl: "app/teacher/exam/template/question.html",
                controller: 'questionListController',
                resolve: {
                    questions: ['$stateParams', 'questionService', function ($stateParams, qs) {
                        return qs.select({cos_id: $stateParams.course_id}).then(function (res) {
                            console.log(res.data);
                            return res.data;
                        })
                    }]
                }
            })
            .state('exam.paper', {
                url: '/paper',
                templateUrl: 'app/teacher/exam/template/paper-container.html',
                controller: 'paperController',
                resolve: {
                    courses: ['courseService', function (cs) {
                        return cs.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
            .state('exam.paper.list', {
                url: '/course/{course_id}/list',
                templateUrl: "app/teacher/exam/template/paper.html",
                controller: 'paperListController',
                resolve: {
                    papers: ['$stateParams', 'paperService', function ($stateParams, ps) {
                        return ps.select({cos_id: $stateParams.course_id}).then(function (res) {
                            return res.data;
                        })
                    }]
                }
            })
            .state('exam.paper-def', {
                url: '/{course_id}/{paper_id}/def',
                templateUrl: 'app/teacher/exam/template/paper-def.html',
                controller: 'paperDefController',
                resolve: {
                    paper: ['$stateParams', 'paperService', function ($stateParams, paperService) {
                        if ($stateParams.paper_id) {
                            return paperService.select({paper_id: $stateParams.paper_id}).then(function (res) {
                                return res.data;
                            })
                        }
                    }],
                    course: ['$stateParams', 'courseService', function ($stateParams, courseService) {
                        return courseService.select({cos_id: $stateParams.course_id}).then(function (res) {
                            return res.data;
                        })
                    }],
                    questions: ['$stateParams', 'questionService', function ($stateParams, questionService) {
                        return questionService.select({cos_id: $stateParams.course_id}).then(function (res) {
                            return res.data;
                        })
                    }]

                }
            })
            .state('exam.publish', {
                url: '/publish/{exam_id}',
                templateUrl: 'app/teacher/exam/template/publish.html',
                controller: 'publishController',
                resolve: {
                    courses: ["courseService", function (cs) {
                        return cs.select().then(function (res) {
                            return res.data;
                        })
                    }],
                    faculties: ['facultyService', function (fs) {
                        return fs.select().then(function (res) {
                            return res.data;
                        })
                    }],
                    majors: ['majorService', function (ms) {
                        return ms.select().then(function (res) {
                            return res.data;
                        })
                    }],
                    classes: ['classService', function (cs) {
                        return cs.select().then(function (res) {
                            return res.data;
                        })
                    }],
                    exam: ['$stateParams', 'examService', function ($sp, es) {
                        if ($sp.exam_id) {
                            return es.select({exam_id: $sp.exam_id}).then(function (res) {
                                return res.data;
                            })
                        } else {
                            return {};
                        }
                    }]
                }
            })
            .state('exam.query', {
                url: "/publish-query",
                templateUrl: 'app/teacher/exam/template/publish-query.html',
                controller: 'publishQueryController',
                resolve: {
                    exam_info: ['examService', function (examService) {
                        return examService.select().then(function (res) {
                            return res.data;
                        })
                    }]
                }
            });
    }]);

angular.module('exam.controller', ['uv.service.tip', 'uv.service.dialog', 'ngDialog', 'pub', 'uv.directive.datetimepicker'])
    .controller('questionController', [
        '$scope', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'questionService', 'courses',
        function ($scope, $state, uvTip, uvDialog, ngDialog, questionService, courses) {
            $scope.courses = courses;
            //$scope.selectCourse = function (course) {
            //    $state.go("exam.course.question", {course_id: course.cos_id});
            //}
        }
    ])
    .controller('questionListController', [
        '$scope', '$state', '$stateParams', '$filter', 'uvTip', 'uvDialog', 'ngDialog', 'questionService', 'courses', 'questions',
        function ($scope, $state, $stateParams, $filter, uvTip, uvDialog, ngDialog, questionService, courses, questions) {
            /**
             * 当前课程对象
             */
            $scope.course = $filter('filter')(courses, {cos_id: $stateParams.course_id})[0];
            /**
             * 当前课程下的题目数组
             * @type {questions|*}
             */
            $scope.questions = questions;
            /**
             * 新增题目
             */
            $scope.add = function () {
                $scope.def();
            };

            /**
             * 删除题目
             * @param idx questions下标
             */
            $scope.del = function (q) {
                uvDialog.confirm("确定删除题目:<br>[" + q.qt_content + "]么?").then(function (ok) {
                    if (ok) {
                        return questionService.del(q.qt_id);
                    }
                }).then(function (res) {
                    if (res && res.ret_code == 0) {
                        uvTip.showTip('删除成功', 1500);
                        $state.reload();
                    } else {
                        uvTip.showTip('删除失败,' + res.ret_msg);
                    }
                })
            };
            /**
             * 定义题目
             * @param question
             */
            $scope.def = function (question) {
                openDialog(question).then(function (ok) {
                    if (ok) {
                        $state.reload();
                    }
                });
            };


            /**
             * 切换现实题目详细信息
             * @param question
             */
            $scope.toggleShowDetail = function (question) {
                question.show_detail = !question.show_detail;
                if (question.show_detail && !question.options)
                    questionService.select_options(question.qt_id).then(function (res) {
                        if (res && res.ret_code == 0) {
                            question.options = res.data;
                        } else {
                            uvTip.showTip("查询题目选项失败," + res.ret_msg);
                        }
                    })
            };
            /**
             * 打开定义题目对话窗
             * @param question 题目对象,为空表示新增
             * @returns {*} 是否定义成功的promise对象
             */
            var openDialog = function (question) {
                $scope._qt = question;
                return ngDialog.open({
                    scope: $scope, closeByDocument: false, showClose: false, overlay: true,
                    template: 'question-input',
                    controller: 'questionDefController'
                }).closePromise.then(function (data) {
                    delete $scope._qt;
                    return data.value;
                });
            };
        }
    ])
    .controller('questionDefController', [
        '$scope', '$filter', '$stateParams', 'uvTip', 'uvDialog', 'questionService',
        function ($scope, $filter, $stateParams, uvTip, uvDialog, questionService) {
            /**
             * 选项title数组
             * @type {Array}
             */
            $scope.opt_titles = "ABCDEFGHIJKLMN".split("");
            /**
             * 初始化题目对象内容
             */
            if (!$scope._qt) {//如果不存在题目对象,表示新定义,初始化题目对象
                $scope._qt = {
                    is_multi: '0',
                    cos_id: $stateParams.course_id,
                    options: [{opt_title: 'A'}, {opt_title: 'B'}, {opt_title: 'C'}, {opt_title: 'D'}]
                };
            } else if (!$scope._qt.options) {//如果没有选项,则再次查询
                questionService.select_options($scope._qt.qt_id).then(function (res) {
                    $scope._qt.options = res.data;
                })
            }

            /**
             * 添加选项
             */
            $scope.addOption = function () {
                console.log($scope._qt);
                $scope._qt.options.push({opt_title: $scope.opt_titles[$scope._qt.options.length]});
            };
            /**
             * 删除选项
             * @param idx 数组坐标
             */
            $scope.delOption = function (idx) {
                var options = $scope._qt.options;
                options.splice(idx, 1);
                for (var i = 0; i < options.length; i++) {
                    options[i].opt_title = $scope.opt_titles[i];
                }
            };

            /**
             * 设置正确答案
             * @param opt
             */
            $scope.setRight = function (opt) {
                if ($scope._qt.is_multi == '0') {
                    angular.forEach($scope._qt.options, function (o) {
                        o.is_right = '0';
                    });
                    opt.is_right = '1';
                } else {
                    opt.is_right = opt.is_right == '1' ? '0' : '1';
                }
            };
            /**
             * 设置多选单选
             * @param isMulti
             */
            $scope.changeMulti = function (isMulti) {
                $scope._qt.is_multi = isMulti;
                console.log(isMulti);
                if (isMulti == 0) {
                    var hasRight = false;
                    angular.forEach($filter('filter')($scope._qt.options, {is_right: '1'}), function (opt) {
                        console.log(opt);
                        if (hasRight) {
                            opt.is_right = '0';
                        } else {
                            hasRight = true;
                        }
                    })
                }
            };

            /**
             * 保存数据库,必须存在正确答案
             */
            $scope.save = function () {
                if ($filter('filter')($scope._qt.options, {is_right: '1'}).length == 0) {
                    uvTip.showTip('请设置正确答案', 1500);
                    return;
                }
                questionService.save_or_update($scope._qt).then(function (res) {
                    if (res && res.ret_code == 0) {
                        uvTip.showTip('保存成功', 1500);
                        $scope.closeThisDialog(1);
                    } else {
                        uvTip.showTip('保存失败,' + res.ret_msg);
                    }
                })
            }
        }
    ])
    .controller('paperController', [
        '$scope', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'courses',
        function ($scope, $state, uvTip, uvDialog, ngDialog, courses) {
            $scope.courses = courses;
        }
    ])
    .controller('paperListController', [
        '$scope', '$state', '$stateParams', '$filter', 'uvTip', 'uvDialog', 'ngDialog', 'paperService', 'courses', 'papers',
        function ($scope, $state, $stateParams, $filter, uvTip, uvDialog, ngDialog, paperService, courses, papers) {
            $scope.course = $filter('filter')(courses, {cos_id: $stateParams.course_id})[0];
            $scope.papers = papers;
            $scope.add = function () {
                $scope.def();
            };
            $scope.def = function (paper) {
                var param = {course_id: $scope.course.cos_id};
                if (paper)param.paper_id = paper.paper_id;
                $state.go("exam.paper-def", param);
            };
            $scope.del = function (paper) {
                uvDialog.confirm("确定删除试卷[" + paper.paper_title + "]?").then(function (ok) {
                    if (ok) {
                        paperService.del(paper.paper_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("删除成功", 1500);
                                $state.reload();
                            } else {
                                uvTip.showTip("删除失败," + res.ret_msg);
                            }
                        })
                    }
                })
            }
        }
    ])
    .controller('paperDefController', [
        '$rootScope', '$scope', '$filter', '$state', 'uvLoading', 'uvTip', 'uvDialog', 'ngDialog', 'paperService', 'paper', 'course', 'questions',
        function ($rootScope, $scope, $filter, $state, uvLoading, uvTip, uvDialog, ngDialog, paperService, paper, course, questions) {
            $scope.questions = questions;
            $scope.course = course;
            $scope.query = {};
            $rootScope.content_title = "[" + course.cos_name + "]" + $scope.content_title;
            /**
             * 处理试卷已经选中的题目.标记题目总体集合中的已选中题目
             */
            uvLoading.loading();
            $scope.question_json = {};
            angular.forEach($scope.questions, function (q) {
                $scope.question_json[q.qt_id] = q;
            });

            if (paper) {
                angular.forEach(paper.questions, function (q) {
                    $scope.question_json[q.qt_id].selected = true;
                    $scope.question_json[q.qt_id].score = q.score;
                });
            }
            uvLoading.unloading();
            $scope.paper = paper || {cos_id: course.cos_id};

            $scope.configQuestion = function () {
                uvDialog.showTemplate("question-input", $scope).then(function (res) {
                    $scope.paper.questions = $filter('filter')($scope.questions, {selected: true});
                    $scope.paper.questions = $filter('orderBy')($scope.paper.questions, "is_multi");
                    $scope.just_select = false;
                    $scope.random = {};
                    stsQuestion();
                });
            };
            /**
             * 题目统计信息生成
             */
            function stsQuestion(notOverWrite) {
                var sts = $scope.sts = $scope.statistics = {
                    multi_count: 0,
                    multi_score: 0,
                    single_count: 0,
                    single_score: 0
                };
                angular.forEach($scope.paper.questions, function (q) {
                    if (q.is_multi == 1) {
                        if (q.score)sts.multi_score += parseInt(q.score);
                        sts.multi_count++;
                    } else {
                        if (q.score)sts.single_score += parseInt(q.score);
                        sts.single_count++;
                    }
                });
                if (!notOverWrite) {
                    $scope.paper.score = sts.single_score + sts.multi_score;
                    $scope.paper.pass_score = parseInt($scope.paper.score * 0.6);
                }
            }

            /**
             * 全选/取消全选.废弃.题量可能很大....
             * @type {boolean}
             */
            var allSelect = false;
            $scope.toggleSelect = function () {
                allSelect = !allSelect;
                angular.forEach($scope.questions, function (q) {
                    q.selected = allSelect;
                })
            };

            /**
             * 删除选中的题目
             * @param idx
             */
            $scope.delQuestion = function (idx) {
                var q = $scope.paper.questions.splice(idx, 1)[0];
                $scope.question_json[q.qt_id].selected = false;
                stsQuestion();
            };

            /**
             * 保存试卷
             */
            $scope.savePaper = function () {
                var ok = true;
                for (var i = 0; i < $scope.paper.questions.length; i++) {
                    var q = $scope.paper.questions[i];
                    console.log(q.score);
                    if (!q.score) {
                        uvTip.showTip("请设置题目分数");
                        ok = false;
                    }
                }
                if (ok) {
                    paperService.save_or_update($scope.paper).then(function (res) {
                        if (res && res.ret_code == 0) {
                            $scope.paper.paper_id = res.data;
                            uvTip.showTip("保存成功", 1500).then(function () {
                                $state.go("exam.paper.list", {course_id: course.cos_id});
                            });
                        } else {
                            uvTip.showTip("保存失败," + res.ret_msg);
                        }
                    });
                }
            };

            /**
             * 分值全改
             */
            $scope.changeScore = function (score) {
                $scope.score = score;
                angular.forEach($scope.paper.questions, function (v) {
                    v.score = score;
                });
                stsQuestion();
            };
            /**
             * 只看选中 代码
             * @type {boolean}
             */
            $scope.just_select = false;
            $scope.justSelect = function () {
                $scope.just_select = !$scope.just_select;
                if ($scope.just_select) {
                    $scope.query.selected = true;
                } else {
                    delete $scope.query.selected;
                }
            };
            /***
             * 随机选题代码
             */
            $scope.random = {};
            $scope.createRandom = function () {
                /**
                 * 单选题随机选择
                 */
                if ($scope.random.single_select_count) {
                    var single_qt = [];
                    var singleQuestions = $filter('filter')($scope.questions, {is_multi: '0'});
                    if ($scope.random.single_select_count > singleQuestions.length) {
                        uvTip.showTip("题库中单选题只有[" + singleQuestions.length + "]道,不足[" + $scope.random.single_select_count + "]道!", 2000);
                        return;
                    }
                    while (single_qt.length < $scope.random.single_select_count) {
                        var t = parseInt(Math.random() * singleQuestions.length);
                        single_qt.push(singleQuestions.splice(t, 1)[0]);
                    }
                    for (var i = 0; i < single_qt.length; i++) {
                        $scope.question_json[single_qt[i].qt_id].selected = true;
                        $scope.question_json[single_qt[i].qt_id].score = $scope.random.single_select_score || 2;
                    }
                }

                /**
                 * 多选题随机选择
                 */
                if ($scope.random.multi_select_count) {
                    var multi_qt = [];
                    var multiQuestions = $filter('filter')($scope.questions, {is_multi: '1'});
                    if ($scope.random.multi_select_count > multiQuestions.length) {
                        uvTip.showTip("题库中多选题只有[" + multiQuestions.length + "]道,不足[" + $scope.random.multi_select_count + "]道!", 2000);
                        return;
                    }
                    while (multi_qt.length < $scope.random.multi_select_count) {
                        var t = parseInt(Math.random() * multiQuestions.length);
                        multi_qt.push(multiQuestions.splice(t, 1)[0]);
                    }
                    for (var i = 0; i < multi_qt.length; i++) {
                        $scope.question_json[multi_qt[i].qt_id].selected = true;
                        $scope.question_json[multi_qt[i].qt_id].score = $scope.random.multi_select_score || 4;
                    }
                }

                $scope.random = {};

            };
            /**
             * 第一次进入本模块,统计试卷题目信息.
             */
            stsQuestion(true);
            $scope.stsQuestion = stsQuestion;
        }
    ])
    .controller('publishController', [
        '$scope', '$state', 'uvTip', 'uvDialog', 'ngDialog', 'pubCourse', 'pubClass',
        'courses', 'exam', 'faculties', 'majors', 'classes', 'paperService', 'examService',
        function ($scope, $state, uvTip, uvDialog, ngDialog, pubCourse, pubClass,
                  courses, exam, faculties, majors, classes, paperService, examService) {
            $scope.courses = courses;
            $scope.course_json = {};
            angular.forEach(courses, function (c) {
                this[c.cos_id] = c;
            }, $scope.course_json);

            $scope.exam = exam || {};
            $scope.faculties = faculties;
            $scope.majors = majors;
            $scope.classes = classes;
            $scope.papers = [];

            /**
             * 如果是修改考试信息,且存在考试课程,查询考试试卷
             */
            if ($scope.exam.cos_id) {
                paperService.select({cos_id: $scope.exam.cos_id}).then(function (res) {
                    $scope.papers = res.data;
                })
            }

            /**
             * 调用公共服务选择课程,同时在选择课程后查询课程关联试卷
             */
            $scope.selectCourse = function () {
                pubCourse.chooseCourse($scope, $scope.courses).then(function (course) {
                    if (course) {
                        $scope.exam.cos_id = course.cos_id;
                        paperService.select({cos_id: course.cos_id}).then(function (res) {
                            $scope.papers = res.data;
                            $scope.paper_json = {};
                            angular.forEach($scope.papers, function (p) {
                                $scope.paper_json[p.paper_id] = p;
                            })
                        });
                    }
                })
            };
            /**
             * 选择班级(调用公共服务)
             */
            $scope.selectClass = function () {
                pubClass.chooseClass($scope, faculties, majors, classes, exam.classes || []).then(function (classes) {
                    if (classes) {
                        $scope.exam.classes = classes;
                    }
                })
            };

            /**
             * 选择试卷后,设置考试exam对象的分值
             */
            $scope.setExamPaper = function () {
                var paper = $scope.paper_json[$scope.exam.paper_id];
                $scope.exam.pass_score = paper.pass_score;
                $scope.exam.score = paper.score;
            };

            $scope.publishExam = function () {
                examService.save_or_update($scope.exam).then(function (res) {
                    if (res && res.ret_code == 0) {
                        uvTip.showTip('发布成功').then(function () {
                            $state.reload();
                        });
                    } else {
                        uvTip.showTip('发布失败,' + res.ret_code);
                    }
                })
            }

        }
    ])
    .controller('publishQueryController', [
        '$rootScope', '$scope', '$filter', '$state', 'uvLoading', 'uvTip', 'uvDialog', 'ngDialog', 'examService', 'exam_info',
        function ($rootScope, $scope, $filter, $state, uvLoading, uvTip, uvDialog, ngDialog, examService, exam_info) {
            $scope.exams = exam_info.exams;
            $scope.now = exam_info.now;
            $scope.modifyExam = function (e) {
                $state.go("exam.publish", {exam_id: e.exam_id});
            };
            $scope.deleteExam = function (idx) {
                var e = $scope.exams[idx];
                uvDialog.confirm("确定取消考试[" + e.exam_title + "]?").then(function (ok) {
                    if (ok) {
                        examService.del(e.exam_id).then(function (res) {
                            if (res && res.ret_code == 0) {
                                uvTip.showTip("取消考试成功", 1500).then(function () {
                                    $state.reload();
                                })
                            } else {
                                uvTip.showTip("取消考试失败," + res.ret_msg);
                            }
                        })
                    }
                })
            }
        }

    ])
;