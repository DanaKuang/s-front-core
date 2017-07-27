/**
 * Author: Kuang
 * Create Date: 2017-07-25
 * Description: setprize
 */

define([], function () {
    var setprize = angular.module('ngui.setprize', []);

    var setprizeFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/setprize.tpl.html'
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

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            }, true);

            

        }

        return defineObj;
    }

    setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', setprizeFn]);
})
