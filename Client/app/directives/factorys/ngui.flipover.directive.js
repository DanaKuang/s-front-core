/**
 * Author: Kuang
 * Create Date: 2017-11-15
 * Description: flipover
 */

define([], function () {
    var flipover = angular.module('ngui.flipover', []);

    var flipoverFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/flipover.tpl.html',
            that_scope: {}
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: false,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['that_scope']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['that_scope']);

                // 一开始进入页面的时候scope.conf是undefined
                scope.that_scope = angular.element('.table').scope();
                
            }, true);

            var g_page = 1;

            scope.prev = function () {
                scope.$emit('frompagechange', event, {
                    currentPageNumber: (g_page - 1) == 0 ? 1 : --g_page,
                    pageSize: 10
                })
            }

            scope.next = function () {
                if (scope.that_scope.list.length == 0) {
                    alert('别点啦，没有更多啦');
                    return
                }
                scope.$emit('frompagechange', event, {
                    currentPageNumber: ++g_page,
                    pageSize: 10
                }) 
            }

        }
        return defineObj;
    }

    flipover.directive('saFlipover', ['$rootScope', '$http', '$compile', '$timeout', 'util', flipoverFn]);
})
