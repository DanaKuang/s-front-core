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
            confUrl: '',
            hours: _.map(Array(24),function(v, i){return i;}),
            startHour: '00:00:00',
            endHour: '00:00:00'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'hours', 'startHour', 'endHour']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'hours', 'startHour', 'endHour']);

                var that_scope = angular.element('.all-template-config-wrap').scope();

                if (that_scope.confUrl == 'unexpected') {
                    scope.confUrl = 'unexpected';
                    $('input[name="startTime"]').datetimepicker({
                        language: "zh-CN",
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        todayBtn: true,
                        minView: 2,
                        startDate: ""
                    }).on('change', function (e) {
                        var startTime = e.target.value;
                        var endTime = scope.endTime;
                        if (endTime < startTime) {
                            scope.endTime = '';
                            scope.$apply();
                        }
                    });
                  
                    $('input[name="endTime"]').datetimepicker({
                        language: "zh-CN",
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        todayBtn: true,
                        minView: 2,
                        startDate: ""
                    }).on('change', function (e) {
                        var endTime = e.target.value;
                        var startTime = scope.startTime;
                        if (startTime > endTime) {
                            scope.startTime = '';
                            scope.$apply();
                        }
                    });
                }

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

                if (that_scope.activityCode) {
                    scope.disabled = true;
                    var caidanconfig = that_scope.conf.data.caidanConfig;
                    scope.startHour = caidanconfig.sduration;
                    scope.endHour = caidanconfig.eduration;

                    scope.drawAreaVal = caidanconfig.adcodes;

                    if (caidanconfig.condition) {
                        scope.plusval = caidanconfig.condition;
                    } else {
                        scope.myPlus = false;
                        $('.plus-draw-cbox').prop('checked', false);
                        scope.drawChance = caidanconfig.probability;
                    }
                }
            }, true);

            $('.draw-area').one('click', function() {
                if (!scope.disabled) {
                    scope.$emit('clickdrawarea', event, {parentCode: 0})
                } else {
                    return
                }
            })

            // 设置中奖概率
            var numReg = /^\d+$/;
            scope.setChance = function (e) {
                var val = e.target.value;
                if (numReg.test(val)) {
                    if (val < 0) {
                        e.target.value = 0;
                    } else if (val > 100) {
                        e.target.value = 100;
                    }
                } else {
                    e.target.value = 0;
                }
                
            }

        }

        return defineObj;
    }

    surpriseactivity.directive('saSurpriseactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', surpriseactivityFn]);
})
