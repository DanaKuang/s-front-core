/**
 * Author: Kuang
 * Create Date: 2017-08-14
 * Description: lookup
 */

define([], function () {
    var lookup = angular.module('ngui.lookup', []);

    var lookupFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/lookup.tpl.html',
            arealist: '',
            sns: '',
            awards: ''
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['sns', 'arealist', 'awards']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['sns', 'arealist', 'awards']);
                if (scope.conf) {
                    var data = scope.conf.data;
                    var activity = data.activity;
                    scope.activityName = activity.activityName;
                    scope.activityDec = activity.activityDec;
                    scope.activityDoc = activity.activityDoc;

                    activity.activitySnSList.forEach(function (n, index) {
                        scope.sns += n.snName + ' '
                    })
         
                    activity.activityAreaList.forEach(function (n, index) {
                        scope.arealist += n.city + ' '
                    })
                 
                    scope.duration = new Date(activity.ctime).toLocaleString() + ' -- ' + new Date(activity.etime).toLocaleString();
                    
                    if (data.dcList.COMMON.length > 0) {
                        data.dcList.COMMON.forEach(function (n, index) {
                            scope.awards += n.awardName + ' '
                        })
                    }

                    if (data.dcList.FIRST_LOTTERY_BE_WON) {
                        if (data.dcList.FIRST_LOTTERY_BE_WON.length > 0) {
                            data.dcList.FIRST_LOTTERY_BE_WON.forEach(function (n, index) {
                                scope.awards += n.awardName + ' '
                            })
                        }
                    }
                }

            }, true);
        }
        return defineObj;
    }

    lookup.directive('saLookup', ['$rootScope', '$http', '$compile', '$timeout', 'util', lookupFn]);
})
