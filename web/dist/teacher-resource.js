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
/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.course', [])
    .service('courseService', ['$http', function ($http) {

        /**
         * 查询课程信息
         * @param course
         */
        this.select = function (course) {
            if (course) {
                if (course.cos_id) {
                    return $http.get('course/' + course.cos_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('courses').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新课程信息,取决于是否存在course_id
         * @param course
         */
        this.save_or_update = function (course) {
            if (course && course.cos_id) {
                return $http.put('course', course).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('course', course).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除课程信息
         * @param course_id
         */
        this.del = function (course_id) {
            if (course_id)
                return $http.delete('course/' + course_id).then(function (res) {
                    return res.data;
                });
        }
    }]);
/**
 * Created by uv2sun on 15/12/28.
 * 考试数据服务
 */
angular.module('resource.exam', [])
    .service('examService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询考试信息
         * @param exam
         */
        this.select = function (exam) {
            if (exam) {
                if (exam.exam_id) {
                    return $http.get('exam/' + exam.exam_id).then(function (res) {
                        return res.data;
                    });
                } else if (exam.cos_id) {
                    return $http.get('exams/course/' + exam.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('exams').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据考试ID查询参加考试班级
         * @param exam_id 考试ID
         * @returns {*}
         */
        this.select_classes = function (exam_id) {
            if (exam_id) {
                return $http.get("exam/" + exam_id + "/classes").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新考试信息,取决于是否存在exam_id
         * @param exam
         */
        this.save_or_update = function (exam) {
            if (exam && exam.exam_id) {
                return $http.put('exam', exam).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('exam', exam).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除考试信息
         * @param exam_id
         */
        this.del = function (exam_id) {
            if (exam_id)
                return $http.delete('exam/' + exam_id).then(function (res) {
                    return res.data;
                });
        }
    }]);
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
/**
 * Created by uv2sun on 15/12/23.
 * 院系数据服务
 */
angular.module('resource.major', [])
    .service('majorService', ['$http', function ($http) {

        /**
         * 查询专业信息
         * @param major
         */
        this.select = function (major) {
            if (major) {
                if (major.major_id) {
                    return $http.get('major/' + major.major_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('majors').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新专业信息,取决于是否存在major
         * @param major
         */
        this.save_or_update = function (major) {
            if (major && major.major_id) {
                return $http.put('major', major).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('major', major).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除专业信息
         * @param major_id
         */
        this.del = function (major_id) {
            if (major_id)
                return $http.delete('major/' + major_id).then(function (res) {
                    return res.data;
                });
        };

        /**
         * 查询专业下的课程
         * @param major_id
         * @returns {*}
         */
        this.selectCourse = function (major_id) {
            if (major_id) {
                return $http.get('major/' + major_id + '/courses').then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 添加专业课程关系
         * @param major_id
         * @param cos_id
         */
        this.addMajorCourse = function (major_id, cos_id) {
            if (major_id && cos_id) {
                return $http.post("major/" + major_id + "/course/" + cos_id).then(function (res) {
                    return res.data;
                })
            }
        };
        /**
         * 删除专业课程关系
         * @param major_id
         * @param cos_id
         * @returns {*}
         */
        this.delMajorCourse = function (major_id, cos_id) {
            if (major_id && cos_id) {
                return $http.delete("major/" + major_id + "/course/" + cos_id).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 查询专业为分配的课程
         * @param major_id
         * @returns {*}
         */
        this.selectCanChooseCourses = function (major_id) {
            if (major_id) {
                return $http.get('major/' + major_id + '/nocourses').then(function (res) {
                    return res.data;
                });
            }
        }
    }]);
/**
 * Created by uv2sun on 15/12/28.
 * 试卷数据服务
 */
angular.module('resource.paper', [])
    .service('paperService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询试卷信息
         * @param paper
         */
        this.select = function (paper) {
            if (paper) {
                if (paper.paper_id) {
                    return $http.get('paper/' + paper.paper_id).then(function (res) {
                        return res.data;
                    });
                } else if (paper.cos_id) {
                    return $http.get('papers/course/' + paper.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('papers').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据试卷ID查询试卷题目
         * @param paper_id 试卷ID
         * @returns {*}
         */
        this.select_questions = function (paper_id) {
            if (paper_id) {
                return $http.get("paper/" + paper_id + "/questions").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新试卷信息,取决于是否存在paper_id
         * @param paper
         */
        this.save_or_update = function (paper) {
            if (paper && paper.paper_id) {
                return $http.put('paper', paper).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('paper', paper).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除试卷信息
         * @param paper_id
         */
        this.del = function (paper_id) {
            if (paper_id)
                return $http.delete('paper/' + paper_id).then(function (res) {
                    return res.data;
                });
        }
    }]);
/**
 * Created by uv2sun on 15/12/28.
 * 考题数据服务
 */
angular.module('resource.question', [])
    .service('questionService', ['$http', '$q', function ($http, $q) {

        /**
         * 查询考题信息
         * @param qt
         */
        this.select = function (qt) {
            if (qt) {
                if (qt.qt_id) {
                    return $http.get('question/' + qt.qt_id).then(function (res) {
                        return res.data;
                    });
                } else if (qt.cos_id) {
                    return $http.get('questions/course/' + qt.cos_id).then(function (res) {
                        return res.data;
                    })
                }
            } else {
                return $http.get('questions').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 根据题目ID查询选项
         * @param qt_id 题目ID
         * @returns {*}
         */
        this.select_options = function (qt_id) {
            if (qt_id) {
                return $http.get("question/" + qt_id + "/options").then(function (res) {
                    return res.data;
                })
            } else {
                var d = $q.defer();
                d.resolve([]);
                return d.promise;
            }
        };

        /**
         * 保存或更新考题信息,取决于是否存在qt_id
         * @param qt
         */
        this.save_or_update = function (qt) {
            if (qt && qt.qt_id) {
                return $http.put('question', qt).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('question', qt).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除考题信息
         * @param qt_id
         */
        this.del = function (qt_id) {
            if (qt_id)
                return $http.delete('question/' + qt_id).then(function (res) {
                    return res.data;
                });
        }
    }]);
/**
 * Created by uv2sun on 15/12/23.
 * 学生数据服务
 */
angular.module('resource.student', [])
    .service('studentService', ['$http', function ($http) {

        /**
         * 查询学生信息
         * @param student
         */
        this.select = function (student) {
            if (student) {
                if (student.std_id) {
                    return $http.get('student/' + student.std_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('students').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 保存或更新学生信息,取决于是否存在std_id
         * @param student
         */
        this.save_or_update = function (student) {
            if (student && student.std_id) {
                return $http.put('student', student).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('student', student).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 删除学生信息
         * @param student_id
         */
        this.del = function (student_id) {
            if (student_id)
                return $http.delete('student/' + student_id).then(function (res) {
                    return res.data;
                });
        }
    }]);
/**
 * Created by uv2sun on 15/12/23.
 * 教师数据服务
 */
angular.module('resource.teacher', [])
    .service('teacherService', ['$http', function ($http) {

        /**
         * 查询教师信息
         * @param teacher
         */
        this.select = function (teacher) {
            if (teacher) {
                if (teacher.tch_id) {
                    return $http.get('teacher/' + teacher.tch_id).then(function (res) {
                        return res.data;
                    });
                } else {
                    //暂时不实现,无需求
                }
            } else {
                return $http.get('teachers').then(function (res) {
                    return res.data;
                });
            }
        };

        /**
         * 查询当前登陆教师
         * @returns {*}
         */
        this.select_login_teacher = function () {
            return $http.get('current_login').then(function (res) {
                return res.data;
            });
        };

        /**
         * 保存或更新教师信息,取决于是否存在tch_id
         * @param teacher
         */
        this.save_or_update = function (teacher) {
            if (teacher && teacher.tch_id) {
                return $http.put('teacher', teacher).then(function (res) {
                    return res.data;
                });
            } else {
                return $http.post('teacher', teacher).then(function (res) {
                    return res.data;
                })
            }
        };

        /**
         * 修改teacher密码
         * @param teacher
         * @returns {*}
         */
        this.changePassword = function (teacher) {
            return $http.put('teacher/password', teacher).then(function (res) {
                return res.data;
            })
        };

        /**
         * 删除教师信息
         * @param teacher_id
         */
        this.del = function (teacher_id) {
            if (teacher_id)
                return $http.delete('teacher/' + teacher_id).then(function (res) {
                    return res.data;
                });
        }
    }]);