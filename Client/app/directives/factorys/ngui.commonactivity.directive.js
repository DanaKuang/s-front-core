/**
 * Author: Kuang
 * Create Date: 2017-07-21
 * Description: commonactivity
*/

define([], function () {
    var nguiCommonActivity = angular.module('ngui.commonactivity', []);

    var nguiCommonActivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/commonactivity.tpl.html',
            pageName: ''
        };
        var defineObj = { //指令定义对象
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        function linkFn (scope, element, attrs) {
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['pageName']);

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['pageName']);
                var allconfigtemplateScope = angular.element('.all-template-config-wrap').scope();
                scope.pageName = allconfigtemplateScope.pageName;
            }, true);

        }

        return defineObj;
    }

    nguiCommonActivity.directive('saCommonactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiCommonActivityFn]);
})
