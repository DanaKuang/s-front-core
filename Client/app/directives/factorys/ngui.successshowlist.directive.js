/**
 * Author: Kuang
 * Create Date: 2017-08-01
 * Description: successshowlist 创建活动成功 展示
 */

define([], function () {
    var successshowlist = angular.module('ngui.successshowlist', []);

    var successshowlistFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/successshowlist.tpl.html',
            successshowlist: []
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['successshowlist']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['successshowlist']);
                if (scope.conf) {
                    var dcList = scope.conf.data.dcList;
                    if (dcList.FIRST_LOTTERY_BE_WON) {
                        scope.successshowlist = dcList.FIRST_LOTTERY_BE_WON.concat(dcList.COMMON)
                    } else {  
                        scope.successshowlist = dcList.COMMON;
                    }
                }

            }, true);

        }
        return defineObj;
    }

    successshowlist.directive('saSuccessshowlist', ['$rootScope', '$http', '$compile', '$timeout', 'util', successshowlistFn]);
})
