/**
 * Author: Kuang
 * Create Date: 2017-10-30
 * Description: create
 */

define([], function () {
    var nguicreate = angular.module('ngui.create', []);

    var nguicreateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/create.tpl.html',
            step: []
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['step']);
            
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['step']);

                scope.step = 0;
                scope.stepstream = scope.conf && scope.conf.step[scope.step];

                // 还需要一个active判断
                
            }, true);   

        }
        return defineObj;
    }

    nguicreate.directive('saCreate', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguicreateFn]);
})
