/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: basicinfo
 */

define([], function () {
    var basicinfo = angular.module('ngui.basicinfo', []);

    var basicinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/basicInfo.tpl.html'
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

    basicinfo.directive('saBasicinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', basicinfoFn]);
})
