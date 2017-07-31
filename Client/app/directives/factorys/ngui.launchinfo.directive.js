/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: participateinfo
 */

define([], function () {
    var launchinfo = angular.module('ngui.launchinfo', []);

    var launchinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/launchinfo.tpl.html',
            selectCompanyVal: '',
            selectBrandVal: '',
            selectSpecificationVal: ''
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['selectCompanyVal', 'selectBrandVal', 'selectSpecificationVal']);

            // 监视conf变化更新 launchinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['selectCompanyVal', 'selectBrandVal','selectSpecificationVal']);
            }, true);

            scope.$watch('selectCompanyVal', function (n, o, s) {
                if (n !== o) {
                    scope.$emit('supplierCode', event, {supplierCode: scope.selectCompanyVal});
                }
            })

            scope.$watch('selectBrandVal', function (n, o, s) {
                if (n !== o) {
                    var productListArr = [];
                    n.forEach(function(n, index){
                        productListArr[index] = {brandCode: n}
                    })
                    scope.$emit('brandCode', event, productListArr);
                }
            })

            $("#selectDurationStart").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss', 
                language: 'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
      
            $("#selectDurationEnd").datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss', 
                language: 'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });

        }

        return defineObj;
    }

    launchinfo.directive('saLaunchinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', launchinfoFn]);
})
