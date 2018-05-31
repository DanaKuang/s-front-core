/**
 * Author: Kuang
 * Create Date: 2017-10-30
 * Description: choosetemplate
 */

define([], function () {
    var nguichoosetemplate = angular.module('ngui.choosetemplate', []);

    var nguichoosetemplateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/choosetemplate.tpl.html'
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

                scope.list = scope.conf && scope.conf.data;
                
                scope.getstartedtoconfig = function (e, type) {
                    var typeData = {
                        type: type
                    };
                    scope.type = type;
                    scope.$emit('choosetype', event, typeData);
                }
            }, true);   

        }
        return defineObj;
    }

    nguichoosetemplate.directive('saChoosetemplate', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguichoosetemplateFn]);
})
