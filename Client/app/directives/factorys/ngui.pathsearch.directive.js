/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Desciption: daysearch
 */
define([], function () {
    var nguipathsearch = angular.module('ngui.pathsearch', []);

    var pathsearchFn = function (util, dff) {
        var defaults = { //默认配置
            tpl: '/pathsearch.tpl.html',
            startTime: '',                           // 开始时间
            endTime: '',                             // 结束时间
            productBrand: '',                        // 品牌
            pbArray: [],                             // 品牌数组
            productName: '',                         // 规格
            pnArray: [],                             // 规格数组
            activityId: '',                            // 活动
            acArray: [],                             // 活动数组
            pgArray: [],                             // 页面
            pagename: '',                            // 页面名称
            pathSearch: function () {}                // 查询函数
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [
                    'startTime',
                    'endTime',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'activityId',
                    'acArray',
                    'pgArray',
                    'pagename',
                    'pathSearch'
                ]);
            // 监视conf变化更新模版
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [
                    'startTime',
                    'endTime',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'activityId',
                    'acArray',
                    'pgArray',
                    'pagename',
                    'pathSearch'
                ]);
            }, true);

            // 开始时间绑定
            $startTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                if (startTime > endTime) {
                    scope.endTime = '';
                    scope.$apply();
                }
            });
            // 结束时间
            $endTime.datetimepicker({
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
        return defineObj;
    };

    nguipathsearch.directive('saPathsearch', ['util', 'dateFormatFilter', pathsearchFn]);
});