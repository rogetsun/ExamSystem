/**
 * 基于dtree的angularjs版tree
 *
 * 注意一级节点的父节点ID要为-1
 *
 * example：
 * <div class="tree" uv-tree="funcs" uv-tree-data="funcs" uv-tree-node-id-key="func_code"
 * uv-tree-node-parent-id-key="par_func_code" uv-tree-node-name-key="func_name" uv-tree-node-selected-key="selected"
 * uv-tree-multi-select="true">
 * </div>
 *
 *
 */
angular.module('uv.directive.tree', [])
    .provider('uvTreeConfig', [function () {
        var imgFolder = "./img";
        return {
            setImgFolder: function (imgFolderPath) {
                imgFolder = imgFolderPath;
            },
            $get: function () {
                return {
                    imgFolder: imgFolder
                }
            }
        }
    }])
    .directive('uvTree', ['$timeout', 'uvTreeConfig', function ($timeout, uvTreeConfig) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                uvTreeData: '=',            //tree的源数据
                uvTreeNodeIdKey: '@',       //tree节点的json对象中表示id的key
                uvTreeNodeParentIdKey: '@', //tree节点的json对象中表示父节点ID的key
                uvTreeNodeNameKey: '@',     //tree节点的json对象中表示名称的key
                uvTreeNodeSelectedKey: '@', //tree节点的json对象中表示当前节点应该已被默认选中的key
                uvTreeMultiSelect: '@',     //tree是否支持多选，现在单选有点问题
                uvTreeSelectNodeFunc: '&'   //暂时没用
            },
            link: function ($scope, elem, attr) {
                var treeScopeName = attr.uvTree || ("_tree" + parseInt(Math.random() * 100));
                window[treeScopeName] = new dTree(treeScopeName, uvTreeConfig.imgFolder);
                $scope.$parent[treeScopeName] = window[treeScopeName];
                window[treeScopeName].config.multiSelect = !!$scope.uvTreeMultiSelect;
                window[treeScopeName].config.checkbox = !!$scope.uvTreeMultiSelect;
                window[treeScopeName].config.useIcons = false;
                var id = $scope.uvTreeNodeIdKey,
                    pid = $scope.uvTreeNodeParentIdKey,
                    name = $scope.uvTreeNodeNameKey,
                    selectKey = $scope.uvTreeNodeSelectedKey;
                angular.forEach($scope.uvTreeData, function (v) {
                    window[treeScopeName].add(v[id], v[pid], v[name], '', '', v[selectKey], v, true);
                });
                var treeHtml = window[treeScopeName].toString();
                elem.html(treeHtml);

            }
        }
    }]);