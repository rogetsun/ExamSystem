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