/**
 * Author: Kuang
 * Create Date: 2017-07-29
 * Description: surpriseactivity
 */

define([], function () {
    var surpriseactivity = angular.module('ngui.surpriseactivity', []);

    var surpriseactivityFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/surpriseactivity.tpl.html',
            confUrl: ''
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

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl']);
                var that_scope = angular.element('.all-template-config-wrap').scope();

                if (that_scope.confUrl == 'unexpected') {
                    scope.confUrl = 'unexpected';
                    $("#drawDurationStart").datetimepicker({
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
              
                    $("#drawDurationEnd").datetimepicker({
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
            }, true);

            var allconfigtemplateScope = angular.element('.pop').scope();
            scope.pageName = allconfigtemplateScope.pageName;

            $(document).ready(function () {
                $(".draw-area .select").multiselect({
                    includeSelectAllOption: true,
                    selectAllText: '全部',
                    selectAllValue: 'all',
                    enableClickableOptGroups: true,
                    enableFiltering: true,
                    buttonWidth: '170px',
                    maxHeight: '200px',
                    numberDisplayed: 1
                });
            });

        }

        return defineObj;
    }

    surpriseactivity.directive('saSurpriseactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', surpriseactivityFn]);
})
