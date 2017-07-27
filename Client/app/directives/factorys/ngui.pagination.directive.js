/**
 * Author: Kuang
 * Create Date: 2017-07-18
 * Description: pagination
 */

define([], function () {
    var nguiPage = angular.module('ngui.pagination', []);

    var nguiPageFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/pagination.tpl.html',
            page: [],
            cur: 0, // 默认标记第一个current
            step: 3,
            code: '',
            pagination: document.getElementById('pagination'),
            activity_page_data: {
                currentPageNumber:1, 
                pageSize: 5
            }
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['page', 'step', 'code', 'cur', 'pagination', 'activity_page_data', 'page']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['page', 'step', 'code', 'cur', 'pagination', 'activity_page_data', 'page']);
                 // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                    var page = scope.conf.data.data.page;
                    var totalPage = page.pageNumber;
                    scope.page = Array.apply(0, Array(totalPage)).map(function(item, index){
                        return index
                    })
                    scope.cur = page.currentPageNumber - 1;
                }
            }, true);

            // nav切换事件绑定
            // 初始的时候
            scope.$emit('frompagechange', event, scope.activity_page_data);

            scope.changePage = function (e, n) {
                scope.cur = (+n);

                scope.activity_page_data = {
                    currentPageNumber: scope.cur + 1,
                    pageSize: 5
                };

                // 页码点击事件触发的时候
                scope.$emit('frompagechange', event, scope.activity_page_data);
            }

            scope.prev = function (e, n) {
                n = +n;
                if (n == 0) {
                    return
                }
                n = n - 1;
                scope.cur = n;
                scope.changePage(e, n)
            }

            scope.next = function (e, n) {
                n = +n;
                if (n == scope.page.length - 1) {
                    return
                }
                n = n + 2;
                scope.cur = n;
                scope.changePage(e, n)
            }

        }
        
        return defineObj;
    }

    nguiPage.directive('saPagination', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiPageFn]);
})
