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