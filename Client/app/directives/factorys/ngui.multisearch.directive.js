/**
 * Author: liubin
 * Create Date: 2017-07-24
 * Desciption: multisearch
 * Array.from(Array(24),(v, i)=>i)
 */
define([], function () {
    var nguimultisearch = angular.module('ngui.multisearch', []);

    var multisearchFn = function (util, mAjax, dff) {
        var defaults = { //默认配置
            tpl: '/multisearch.tpl.html',
            startTime: '',                           // 开始时间
            endTime: '',                             // 结束时间
            hours: Array.from(Array(24),function(v, i){return i;}),  // 小时
            productBrand: '',                        // 品牌
            pbArray: [],                             // 品牌数组
            productName: '',                         // 规格
            pnArray: [],                             // 规格数组
            productPack: '',                         // 包装
            ppArray: [],                             // 包装数组
            saleZone: '',                            // 销区
            szArray: ['重点销区','发展销区','普通销区'], // 销区数组
            provinceName: '',                        // 省
            prNArray: [],                            // 省数组
            cityName: '',                            // 市
            cnArray: [],                             // 市数组
            result: []                               // 查询结果
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
            var $staTime = $("[name='startTime']");
            var $endTime = $("[name='endTime']");
            var $li = $(".ui-result-list");

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [
                    'startTime',
                    'endTime',
                    'startHour',
                    'endHour',
                    'hours',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'productPack',
                    'ppArray',
                    'saleZone',
                    'szArray',
                    'provinceName',
                    'prNArray',
                    'cityName',
                    'cnArray',
                    'result'
                ]);
            // 监视conf变化更新模版
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}),
                [
                    'startTime',
                    'endTime',
                    'startHour',
                    'endHour',
                    'hours',
                    'productBrand',
                    'pbArray',
                    'productName',
                    'pnArray',
                    'productPack',
                    'ppArray',
                    'saleZone',
                    'szArray',
                    'provinceName',
                    'prNArray',
                    'cityName',
                    'cnArray',
                    'result'
                ]);
            }, true);

            //时间绑定
            $staTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: "2013-02-14"
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                if (endTime < startTime) {
                    scope.endTime = '';
                    scope.$apply();
                }
            });
            $endTime.datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: "2013-02-14"
            }).on('change', function (e) {
                var endTime = e.target.value;
                var startTime = scope.startTime;
                if (startTime > endTime) {
                    scope.startTime = '';
                    scope.$apply();
                }
            });

            // 监控变化
            scope.$watch('productBrand + productName + productPack + saleZone + provinceName + cityName', function(n, o, s) {
                if (n !== o) {
                    var $ar = [];
                    s.productBrand.length && $ar.push('<li>'+s.productBrand.join(',')+'<i class="close" name="productBrand"></i></li>');
                    s.productName.length  && $ar.push('<li>'+s.productName.join(',')+'<i class="close" name="productName"></i></li>');
                    s.productPack.length  && $ar.push('<li>'+s.productPack.join(',')+'<i class="close" name="productPack"></i></li>');
                    s.saleZone.length     && $ar.push('<li>'+s.saleZone.join(',')+'<i class="close" name="saleZone"></i></li>');
                    s.provinceName.length && $ar.push('<li>'+s.provinceName.join(',')+'<i class="close" name="provinceName"></i></li>');
                    s.cityName.length     && $ar.push('<li>'+s.cityName.join(',')+'<i class="close" name="cityName"></i></li>');
                    $li.html($ar.join(''));
                }
            });

            // 事件代理
            $li.on('click', 'li>i.close', function (e) {
                var name = e.target.attributes.name.value;
                scope[name] = '';
                scope.$apply();
            });
        }
        return defineObj;
    };

    nguimultisearch.directive('saMultisearch', ['util', 'mAjax', 'dateFormatFilter', multisearchFn]);
});