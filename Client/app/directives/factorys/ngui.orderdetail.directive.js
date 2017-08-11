/**
 * Author: Kuang
 * Create Date: 2017-08-04
 * Description: orderdetail
 */

define([], function () {
    var orderdetail = angular.module('ngui.orderdetail', []);

    var orderdetailFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/orderdetail.tpl.html'
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
                    scope.awardPrice = data.awardPrice;
                    scope.detail = data.detail;
                    scope.gettime = new Date(data.ctime).toLocaleString();
                    scope.getaddress = data.awardProvince + data.awardCity + data.awardDistrict + data.awardDetail;
                    scope.orderChannel = data.orderChannel;
                    scope.orderStatus = data.orderStatus;
                    scope.receiver = data.receiver;
                    scope.mobile = data.mobile;
                    scope.logisticalCompany = data.logisticalCompany;
                    scope.logisticalCode = data.logisticalCode;
                }

            }, true);
        }
        return defineObj;
    }

    orderdetail.directive('saOrderdetail', ['$rootScope', '$http', '$compile', '$timeout', 'util', orderdetailFn]);
})
