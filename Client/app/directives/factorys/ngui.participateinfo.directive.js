/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: participateinfo
 */

define([], function () {
    var participateinfo = angular.module('ngui.participateinfo', []);

    var participateinfoFn = function ($rootScope, $http, $compile, $timeout, util, numberFormat, decimalFormat) {
        var defaults = { //默认配置
            tpl: '/participateinfo.tpl.html'
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nameIntegral', 'namePerPersonDay', 'namePerPerson']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nameIntegral', 'namePerPersonDay', 'namePerPerson']);
            }, true);

            var that_scope = angular.element('.all-template-config-wrap').scope();
            // 判断是否从编辑活动过来
            if (that_scope.activityCode) {
                scope.disabled = true;
                var activity = that_scope.conf.data.activity;
                var pre = that_scope.conf.data.preList[0];
                if (pre.payType === '2') {
                    // 参与消耗积分
                    scope.nameIntegral = pre.num;
                }
                scope.namePerPersonDay = activity.dayLimit;
                scope.namePerPerson = activity.allLimit;
            }

            // 开头不为0的数字校验
            scope.verify = function (event) {
                numberFormat.notminusnotzero(event)
            }

            $('input[type="number"]').on('input', function (e) {
                if (e.target.value > 10) {
                    e.target.value = e.target.value.slice(0, 10)
                }
            })
        }

        return defineObj;
    }

    participateinfo.directive('saParticipateinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'decimalFormat', participateinfoFn]);
})
