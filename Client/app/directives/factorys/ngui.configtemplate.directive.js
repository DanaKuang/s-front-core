/**
 * Author: Kuang
 * Create Date: 2017-11-17
 * Description: activityconfiguation
 */

define([], function () {
    var nguiconfigtemplate = angular.module('ngui.configtemplate', []);

    var nguiconfigtemplateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/configtemplate.tpl.html'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);

                // scope.conf.confUrl = scope.conf && scope.conf.data[0].confUrl;
            }, true);   

        }
        return defineObj;
    }

    nguiconfigtemplate.directive('saConfigtemplate', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiconfigtemplateFn]);
})
