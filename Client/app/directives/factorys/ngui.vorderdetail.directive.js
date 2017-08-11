/**
 * Author: Kuang
 * Create Date: 2017-08-05
 * Description: vorderdetail
 */

define([], function () {
    var vorderdetail = angular.module('ngui.vorderdetail', []);

    var vorderdetailFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/vorderdetail.tpl.html'
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
                if (scope.conf) {
                    var data = scope.conf.data;
                    scope.orderCode = data.orderCode;
                    scope.prizeWinner = data.prizeWinner;
                    scope.activityName = data.activityName;
                    scope.prizeName = data.prizeName;
                    scope.awardName = data.awardName;
                    scope.brandName = data.brandName;
                    scope.unitFullName = data.unitFullName;
                    scope.orderChannel = data.orderChannel;
                    scope.mobile = data.mobile;
                }

            }, true);
        }
        return defineObj;
    }

    vorderdetail.directive('saVorderdetail', ['$rootScope', '$http', '$compile', '$timeout', 'util', vorderdetailFn]);
})
