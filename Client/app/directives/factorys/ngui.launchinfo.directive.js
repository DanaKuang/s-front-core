/**
 * Author: Kuang
 * Create Date: 2017-07-24
 * Description: participateinfo
 */

define([], function () {
    var launchinfo = angular.module('ngui.launchinfo', []);

    var launchinfoFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/launchinfo.tpl.html'
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

            // 监视conf变化更新 launchinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            }, true);

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

            scope.changeRadio = function () {
                 console.log(scope.whichday)
            }

        }

        return defineObj;
    }

    launchinfo.directive('saLaunchinfo', ['$rootScope', '$http', '$compile', '$timeout', 'util', launchinfoFn]);
})
