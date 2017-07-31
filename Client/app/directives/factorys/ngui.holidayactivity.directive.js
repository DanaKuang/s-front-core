/**
 * Author: Kuang
 * Create Date: 2017-07-30
 * Description: holidayactivity
 */

define([], function () {
    var holidayactivity = angular.module('ngui.holidayactivity', []);

    var holidayactivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/holidayactivity.tpl.html'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['commonActivity']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['commonActivity']);
            }, true);

            var allconfigtemplateScope = angular.element('.pop').scope();
            scope.pageName = allconfigtemplateScope.pageName;

        }

        return defineObj;
    }

    holidayactivity.directive('saHolidayactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', holidayactivityFn]);
})
