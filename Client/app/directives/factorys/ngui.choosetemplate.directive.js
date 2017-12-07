/**
 * Author: Kuang
 * Create Date: 2017-10-30
 * Description: choosetemplate
 */

define([], function () {
    var nguicreate = angular.module('ngui.create', []);

    var nguicreateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/choosetemplate.tpl.html'
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

    nguicreate.directive('saCreate', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguicreateFn]);
})
