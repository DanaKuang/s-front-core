/**
 * Author: Kuang
 * Create Date: 2017-11-1
 * Description: turnpage
 */

define([], function () {
    var nguiturnpage = angular.module('ngui.turnpage', []);

    var nguiturnpageFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/turnpage.tpl.html'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            
            scope.$watch('conf', function () {
                // 属性赋值

                
            }, true);   

        }
        return defineObj;
    }

    nguiturnpage.directive('saTurnpage', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiturnpageFn]);
})
