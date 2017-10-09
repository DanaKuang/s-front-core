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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber', 'size']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber', 'size']);
                if (scope.conf && scope.conf.data) {
                    var page = scope.conf.data.page;
                    scope.totalCount = page.count;
                    scope.size = page.pageNumber > 1 ? page.pageSize : page.count;
                    scope.curPage = page.currentPageNumber;
                    scope.pageNumber = page.pageNumber;
                }
            }, true);

            scope.edit = function (e) {
                var sn = $(e.target).data('sn');
                scope.$emit('edit', event, {
                    sn: sn
                })
            }

            scope.delete = function (e) {
                var r = confirm('确定要删除吗？');
                if (r == false) {
                    return
                }
                var id = $(e.target).data('id');
                scope.$emit('delete', event, {
                    id: id
                })
            }
        }
        return defineObj;
    }

    cigarettelist.directive('saCigarettelist', ['$rootScope', '$http', '$compile', '$timeout', 'util', cigarettelistFn]);
})
