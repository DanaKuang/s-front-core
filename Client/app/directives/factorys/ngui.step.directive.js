/**
 * Author: Kuang
 * Create Date: 2017-10-30
 * Description: step
 */

define([], function () {
    var nguistep = angular.module('ngui.step', []);

    var nguistepFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/step.tpl.html',
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
 

        }
        return defineObj;
    }

    nguistep.directive('saStep', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguistepFn]);
})
