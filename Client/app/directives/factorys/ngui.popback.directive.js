/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: popback
 */

define([], function () {
    var popback = angular.module('ngui.popback', []);

    var popbackFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/popback.tpl.html'
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

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            }, true);

            $('.pop-back').on('click', function(){
                // 请求接口就好
                scope.$emit('popback', event, {}); 
            })
        }

        return defineObj;
    }

    popback.directive('saPopback', ['$rootScope', '$http', '$compile', '$timeout', 'util', popbackFn]);
})
