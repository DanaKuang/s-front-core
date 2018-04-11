/**
 * Author: Kuang
 * Create Date: 2017-11-17
 * Description: activityconfiguation
 */

define([], function () {
    var nguicommonconfig = angular.module('ngui.commonconfig', []);

    var nguicommonconfigFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/commonconfig.tpl.html'
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
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);

                
            }, true);   

        }
        return defineObj;
    }

    nguicommonconfig.directive('saommonconfig', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguicommonconfigFn]);
})
