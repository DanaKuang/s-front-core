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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl']);

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl']);

            }, true);

            var allconfigtemplateScope = angular.element('.pop').scope();
            scope.pageName = allconfigtemplateScope.pageName;

            scope.updateActivity = function () {
                var _basicScope = angular.element('.activity-name').scope();
                var _participateScope = angular.element('.participate-integral').scope();
                var _launchScope = angular.element('.select-company').scope();
                var fromSonScope = {
                    activityForm: '',
                    pageName: scope.pageName,
                    name: _basicScope.nameVaule,  
                    attachUrl: '',               
                    idx: _basicScope.namePriority,
                    score: _participateScope.nameIntegral,
                    limitPer: _participateScope.namePerPersonDay,
                    limitAll: _participateScope.namePerPerson,
                    supplier: _launchScope.selectCompanyVal,
                    brands: _launchScope.selectBrandVal,
                    sns: _launchScope.selectSpecificationVal,
                    areaCodes: _launchScope.selectAreaVal,
                    holiday: _launchScope.whichday,
                    specialCode: 'FIRST_LOTTERY_BE_WON',
                    specialAwards: [],
                    specialAwardPics: [],
                    specialAwardNums: [],
                    specialAwardScores: [],
                    chance: [],
                    commonAwards: [],
                    commonAwardPics: [], 
                    commonAwardNums: [],
                    commonAwardScores: [],
                    stime: _launchScope.selectDurationStart,
                    etime: _launchScope.selectDurationEnd,
                    status: $('.online').prop('checked') ? 1 : 0
                } 
                scope.$emit('fromcommonactivity', event, fromSonScope);
            }

        }

        return defineObj;
    }

    nguiCommonActivity.directive('saCommonactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiCommonActivityFn]);
})
