/**
 * Author: Kuang
 * Create Date: 2017-07-29
 * Description: surpriseactivity
 */

define([], function () {
    var surpriseactivity = angular.module('ngui.surpriseactivity', []);

    var surpriseactivityFn = function ($rootScope, $http, $compile, $timeout, util, decimalFormat) {
        var defaults = { //默认配置
            tpl: '/surpriseactivity.tpl.html',
            confUrl: '',
            hours: _.map(Array(25),function(v, i){return i;}),
            startHour: '00:00:00',
            endHour: '00:00:00',
            intervalHours: _.map(Array(24),function (v,i){return i+1}),
            intervalHour: '1'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'hours', 'startHour', 'endHour', 'intervalHours', 'intervalHour', 'intervalHourperson']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['confUrl', 'hours', 'startHour', 'endHour', 'intervalHours', 'intervalHour', 'intervalHourperson']);

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

                var allconfigtemplateScope = angular.element('.all-template-config-wrap').scope();
                scope.pageName = allconfigtemplateScope.pageName;

                if (that_scope.activityCode) {
                    // 编辑
                    scope.disabled = true;
                    scope.edit = true;
                    var caidanconfig = that_scope.conf.data.caidanConfig;
                    scope.startHour = caidanconfig.sduration;
                    scope.endHour = caidanconfig.eduration;
                    scope.intervalHour = caidanconfig.duration;
                    scope.intervalHourperson = caidanconfig.playPerson;
                    scope.drawAreaVal = caidanconfig.adcodes;
                    scope.adcodenames = caidanconfig.adnames;

                    if (caidanconfig.condition) {
                        scope.plusval = caidanconfig.condition;
                    } else {
                        scope.myPlus = false;
                        $('.plus-draw-cbox').prop('checked', false);
                        scope.drawChance = caidanconfig.probability;
                    }
                } else {
                    // 新建
                    $('.draw-area').one('click', function() {
                        if (!scope.disabled) {
                            scope.$emit('clickdrawarea', event, {parentCode: ''})
                        }
                    })

                    // 设置中奖概率
                    scope.setChance = function (event) {
                        decimalFormat.decimalnumber(event);
                        scope.drawChance = event.target.value;
                    }

                    scope.parseFloat = function (event) {
                        if (event.target.value) {
                            event.target.value = parseFloat(event.target.value);
                        } else {
                            event.target.value == ''
                        }
                    }
                }
            }, true);
        }

        return defineObj;
    }

    surpriseactivity.directive('saSurpriseactivity', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'decimalFormat', surpriseactivityFn]);
})
