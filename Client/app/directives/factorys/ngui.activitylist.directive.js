/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: actsample
 */

define([], function () {
    var activitylist = angular.module('ngui.activitylist', []);

    var activitylistFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/activitylist.tpl.html',
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
                    var data = scope.conf.data;
                    var page = data.page;
                    scope.list = data.list;
                    scope.totalCount = page.count;
                    scope.size = page.pageSize;
                    scope.curPage = page.currentPageNumber;
                    scope.pageNumber = page.pageNumber;
                }
            }, true);
        }
        return defineObj;
    }

    activitylist.directive('saActivitylist', ['$rootScope', '$http', '$compile', '$timeout', 'util', activitylistFn]);
})
