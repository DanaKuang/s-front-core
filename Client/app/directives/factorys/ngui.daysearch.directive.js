/**
 * Author: liubin
 * Create Date: 2017-07-24
 * Desciption: daysearch
 */
define([], function () {
    var nguidaysearch = angular.module('ngui.daysearch', []);

    var daysearchFn = function (util, dff) {
        var defaults = { //默认配置
            tpl: '/dayanalysis.tpl.html',
            startTime: '',                           // 开始时间
            endTime: '',                             // 结束时间
            b_startTime: '',                         // 开始时间
            b_endTime: '',                           // 结束时间
            productBrand: '',                        // 品牌
            pbArray: [],                             // 品牌数组
            productName: '',                         // 规格
            pnArray: [],                             // 规格数组
            activity: '',                            // 活动
            acArray: [],                             // 活动数组
            daySearch: ''                            // 查询函数
        };
        var defineObj = {
            restrice: 'AE',
            replace: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.tpl || defaults.tpl;
            },
            scope: {
                conf: '='
            },
            link: linkFn
        };

        // link
        function linkFn (scope, element, attrs) {
            var $startTime = $("[name='startTime']");
            var $endTime = $("[name='endTime']");
            var $b_startTime = $("[name='b_startTime']");
            var $b_endTime = $("[name='b_endTime']");

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [
                    'startTime',
                    'endTime',
                    'b_startTime',
                    'b_endTime',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'activity',
                    'acArray',
                    'daySearch'
                ]);
            // 监视conf变化更新模版
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [

                    'startTime',
                    'endTime',
                    'b_startTime',
                    'b_endTime',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'activity',
                    'acArray',
                    'daySearch'
                ]);
            }, true);


            // 开始时间绑定
            $startTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                endDate: dff.date(+new Date)
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                var b_startTime = scope.b_startTime;
                if (startTime > endTime) {
                    scope.endTime = startTime;
                    endTime = startTime;
                    scope.$apply();
                }
                if (!b_startTime || !startTime || !endTime) {
                    scope.b_startTime = '';
                    scope.b_endTime = '';
                    scope.$apply();
                    return;
                }
                var min = new Date(endTime) - new Date(startTime);
                scope.b_endTime = dff.date(+new Date(b_startTime) + min);
                scope.$apply();
            });
            // 结束时间
            $endTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                endDate: dff.date(+new Date)
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = scope.startTime;
                var b_startTime = scope.b_startTime;
                if (startTime > endTime) {
                    scope.startTime = endTime;
                    startTime = endTime;
                    scope.$apply();
                }
                if (!b_startTime || !startTime || !endTime) {
                    scope.b_startTime = '';
                    scope.b_endTime = '';
                    scope.$apply();
                    return;
                }
                var min = new Date(endTime) - new Date(startTime);
                scope.b_endTime = dff.date(+new Date(b_startTime) + min);
                scope.$apply();
            });
            // 对比开始时间
            $b_startTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var b_startTime = e.target.value;
                var startTime = scope.startTime;
                var endTime = scope.endTime;
                if (!b_startTime || !startTime || !endTime) {
                    scope.b_startTime = '';
                    scope.b_endTime = '';
                    scope.$apply();
                    return;
                }
                var min = new Date(endTime) - new Date(startTime);
                scope.b_endTime = dff.date(+new Date(b_startTime) + min);
                scope.$apply();
            });
            // 监控checked变化清空日期
            scope.fixDateInput = function (checked) {
                if (!checked) {
                    scope.b_startTime = "";
                    scope.b_endTime = "";
                }
            };

        }
        return defineObj;
    };

    nguidaysearch.directive('saDaysearch', ['util', 'dateFormatFilter', daysearchFn]);
});