/**
 * Author: Kuang
 * Create Date: 2017-07-20
 * Description: actsample
 */

define([], function () {
    var nguiActsample = angular.module('ngui.actsample', []);

    var nguiActsampleFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/actsample.tpl.html',
            actsampleList: [],
            type: ''
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['actsampleList', 'type']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['actsampleList', 'type']);

                scope.actsampleList = scope.conf && scope.conf.data;
            }, true);
            
            scope.newActSample = function(e, type) {
                var typeData = {type: type};
                scope.type = type;
                scope.$emit('typefromActSample', event, typeData);
                $('.modal-content .close').trigger('click');
            }

        }
        return defineObj;
    }

    nguiActsample.directive('saActsample', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiActsampleFn]);
})
