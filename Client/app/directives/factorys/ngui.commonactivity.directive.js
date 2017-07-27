/**
 * Author: Kuang
 * Create Date: 2017-07-21
 * Description: commonactivity
*/

define([], function () {
    var nguiCommonActivity = angular.module('ngui.commonactivity', []);

    var nguiCommonActivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/commonactivity.tpl.html'
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

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);

            }, true);

            var allconfigtemplateScope = angular.element('.pop').scope();
            scope.pageName = allconfigtemplateScope.pageName;

            scope.updateActivity = function () {
                var _basicScope = angular.element('.activity-name').scope();
                var _participateScope = angular.element('.participate-integral').scope();
                var _launchScope = angular.element('.select-company').scope();
                var fromSonScope = {
                    nameValue: _basicScope.nameVaule,                   
                    namePriority: _basicScope.namePriority,
                    nameIntegral: _participateScope.nameIntegral,
                    namePerPersonDay: _participateScope.namePerPersonDay,
                    namePerPerson: _participateScope.namePerPerson,
                    selectCompanyVal: _launchScope.selectCompanyVal,
                    selectDurationStart: _launchScope.selectDurationStart,
                    selectDurationEnd: _launchScope.selectDurationEnd,
                    whichday: _launchScope.whichday
                } 
                scope.$emit('fromcommonactivity', event, fromSonScope);
            }

        }

        return defineObj;
    }

    nguiCommonActivity.directive('saCommonactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiCommonActivityFn]);
})
