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