/*!
 * ExamSystem - JS for Debug
 * @licence ExamSystem - v1.0.0 (2016-01-13)
 */
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
            uvLoadingProvider.setLoadingGif('assets/diy/uv-loading/loading.gif');
            $urlRouterProvider.otherwise("/index");
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

            //  去掉URL的"#"
            $locationProvider.html5Mode(true);

        }])
    .run(['$state', '$rootScope', 'uvLoading', 'teacherService',
        function ($state, $rootScope, uvLoading, teacherService) {
            teacherService.select_login_teacher().then(function (res) {
                $rootScope.login_user = res.data;
                $rootScope.login_user_id = res.data.tch_id;
            });
            /**
             * 检测状态改变时,改变rootScope中的current_state_name,
             * 同时判断如果改变大模块,则改变left_states
             */
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                uvLoading.loading();

            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
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

/**
 * Created by uv2sun on 15/12/31.
 * 专业班级选择公共服务,提供dialog选择,返回数组
 * 依赖:
 *      uvDialog, uvTree
 */

angular.module('pub.class', ['uv.service.dialog', 'uv.directive.tree'])
    .config(['uvTreeConfigProvider', function (uvTreeProvider) {
        uvTreeProvider.setImgFolder("assets/diy/uv-tree/img");
    }])
    .service('pubClass', ['uvDialog', '$filter', function (uvDialog, $filter) {
        this.chooseClass = function (scope, faculties, majors, classes, selectedClasses, isMulti) {
            return chooseClass(scope, faculties, majors, classes, selectedClasses, isMulti);
        };

        /**
         * 选择班级公共服务,提供dialog界面选择课程,返回班级数组promise
         * @param scope
         * @param faculties
         * @param majors
         * @param classes
         * @param selectedClasses
         */
        var chooseClass = function (scope, faculties, majors, classes, selectedClasses, isMulti) {
            var tmp_json = {};

            var trees = [];
            var root = {id: 0, name: '学校', pid: -1};
            trees.push(root);

            tmp_json[root.id] = root;
            angular.forEach(faculties, function (v) {
                var n = {id: "f" + v.fac_id, name: v.fac_name, pid: 0, data: v};
                tmp_json[n.id] = n;
                trees.push(n);
            });
            angular.forEach(majors, function (v) {
                var n = {id: "m" + v.major_id, name: v.major_name, pid: "f" + v.fac_id, data: v};
                tmp_json[n.id] = n;
                trees.push(n);
            });

            angular.forEach(classes, function (v) {
                var n = {id: "c" + v.cls_id, name: v.cls_no, pid: "m" + v.major_id, data: v};
                trees.push(n);
                tmp_json[n.id] = n;
            });
            angular.forEach(selectedClasses, function (v) {
                setSelected(v);
            });
            /**
             * 选中节点node和他的父节点
             * @param node
             */
            function setSelected(cls) {
                var t = tmp_json["c" + cls.cls_id];
                while (t && !t.selected) {
                    console.log(t);
                    t.selected = true;
                    t = tmp_json[t.pid];
                }
            }

            return uvDialog.showTemplate(
                "app/teacher/public/template/class-select.html",
                scope,
                {_toSelectTree: trees},
                'classSelectController'
            );
        };

    }])
    .controller('classSelectController', [
        '$scope',
        function ($scope) {
            $scope.class_tree_name = "class_tree";
            $scope.tree_data = $scope._toSelectTree;
            $scope.ok = function () {
                var selectedClass = [];
                angular.forEach($scope.class_tree.getSelected(), function (v) {
                    if (typeof v.id === "string" && v.id.charAt(0) == 'c') {
                        selectedClass.push(v.data);
                    }
                });
                console.log(selectedClass);
                $scope.closeThisDialog(selectedClass);
            }
        }
    ]);
/**
 * Created by uv2sun on 15/12/31.
 */

angular.module('pub.course', ['uv.service.dialog'])
    .service('pubCourse', ['uvDialog', function (uvDialog) {
        this.chooseCourse = function (scope, courses) {
            return chooseCourse(scope, courses);
        };

        /**
         * 选择课程公共服务,提供dialog界面选择课程,返回课程promise
         * @param scope
         * @param courses
         */
        var chooseCourse = function (scope, courses) {
            return uvDialog.showTemplate("app/teacher/public/template/course-select.html", scope, {toSelectCourses: courses}, [
                '$scope', '$location', '$anchorScroll',
                function ($scope, $location, $anchorScroll) {
                    $scope.selected_course = null;
                    $scope.cs = {};
                    angular.forEach($scope.toSelectCourses, function (c) {
                        var py = $.toJianpin(c.cos_name)[0];
                        var title = py.charAt(0).toUpperCase();
                        if (!this[title]) {
                            this[title] = [];
                        }
                        this[title].push(c);
                    }, $scope.cs);

                    $scope.titles = [];
                    angular.forEach($scope.cs, function (v, k) {
                        this.push(k);
                    }, $scope.titles);

                    $scope.goto = function (t) {
                        $location.hash(t);
                        $anchorScroll();
                    };
                }
            ]);
        }
    }]);
/**
 * Created by uv2sun on 15/12/31.
 */
angular.module('pub', ['pub.course', 'pub.class']);
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


/**
 * Created by uv2sun on 15/12/25.
 */
angular.module('tsc', ['teacher', 'class', 'student'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('tsc', {
            parent: 'index',
            url: '/tsc',
            template: '<ui-view></ui-view>',
            data: {
                left_states: [
                    {title: '教师管理', state_name: 'tsc.teacher'},
                    {title: '班级管理', state_name: 'tsc.class'},
                    {title: '学生管理', state_name: 'tsc.student'}
                ]
            }
        })
    }]);