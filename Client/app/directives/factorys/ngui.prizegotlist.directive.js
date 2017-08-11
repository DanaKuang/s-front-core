/**
 * Author: Kuang
 * Create Date: 2017-08-04
 * Description: actsample
 */

define([], function () {
    var prizegotlist = angular.module('ngui.prizegotlist', []);

    var prizegotlistFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/prizegotlist.tpl.html',
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

            scope.showdetail = function (e) {
                var orderid = {orderCode: e.target.dataset.orderid};
                scope.$emit('orderid', event, orderid)
            }
        }
        return defineObj;
    }

    prizegotlist.directive('saPrizegotlist', ['$rootScope', '$http', '$compile', '$timeout', 'util', prizegotlistFn]);
})
