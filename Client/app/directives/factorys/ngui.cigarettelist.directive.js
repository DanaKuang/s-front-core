/**
 * Author: Kuang
 * Create Date: 2017-09-21
 * Description: cigarettelist
 */

define([], function () {
    var cigarettelist = angular.module('ngui.cigarettelist', []);

    var cigarettelistFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/cigarettelist.tpl.html',
            list: [],
            totalCount: 0,
            size: 0,
            curPage: 1,
            pageNumber: 1
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

                // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                   // scope.list = scope.conf.data.list
                }
            }, true);
        }
        return defineObj;
    }

    cigarettelist.directive('saCigarettelist', ['$rootScope', '$http', '$compile', '$timeout', 'util', cigarettelistFn]);
})
