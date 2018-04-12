/**
 * Author: liubin
 * Create Date: 2017-07-24
 * Desciption: multisearch
 * Array.from(Array(24),(v, i)=>i)
 * Array.from(Array(24),function(v, i){return i;}) IE不支持，好坑from
 */
define([], function () {
    var nguimultisearch = angular.module('ngui.multisearch', []);

    var multisearchFn = function (util, mAjax, dff) {
        var defaults = { //默认配置
            tpl: '/multisearch.tpl.html',
            startTime: '',                           // 开始时间
            endTime: '',                             // 结束时间
            hours: _.map(Array(24),function(v, i){return i;}),  // 小时
            productBrand: '',                        // 品牌
            pbArray: [],                             // 品牌数组
            productName: '',                         // 规格
            pnArray: [],                             // 规格数组
            productPack: '',                         // 包装
            ppArray: [],                             // 包装数组
            saleZone: '',                            // 销区
            szArray: [],                             // 销区数组
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
            var $staHour = $("[name='startHour']");
            var $endTime = $("[name='endTime']");
            var $endHour = $("[name='endHour']");
            var $li = $(".ui-result-list");

            // 小时限制 开始时间
            $($staHour).change(function (e) {
                if(scope.startTime === scope.endTime) {
                    if (e.currentTarget.value > $($endHour).val()) {
                        $($endHour).val(e.currentTarget.value);
                    }
                }
            });
            // 小时限制 结束时间
            $($endHour).change(function (e) {
                if(scope.startTime === scope.endTime) {
                    if (e.currentTarget.value < $($staHour).val()) {
                        $($staHour).val(e.currentTarget.value);
                    }
                }
            });

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
                endDate: dff.date(+new Date)
            }).on('change', function (e) {
                var startTime = e.target.value;
                var endTime = scope.endTime;
                if (endTime < startTime) {
                    scope.endTime = startTime;
                    scope.$apply();
                }
            });
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
                if (startTime > endTime) {
                    scope.startTime = endTime;
                    scope.$apply();
                }
            });

            // 监控变化
            scope.$watch('startTime + startHour + endTime + endHour + productBrand + productName + productPack + saleZone + provinceName + cityName', function(n, o, s) {
                function f (arr) {
                    return _.map(arr, function (a) {
                        return a.split('_')[0];
                    }).join(',');
                }
                if (n !== o) {
                    var $ar = [];
                    s.startTime && $ar.push('<li>'+s.startTime+'_'+s.startHour+':00:00'+'</li>');
                    s.endTime && $ar.push('<li>'+s.endTime+'_'+s.endHour+':00:00'+'</li>');
                    s.productBrand.length && $ar.push('<li>'+s.productBrand.join(',')+'<i class="close" name="productBrand"></i></li>');
                    s.productName.length  && $ar.push('<li>'+s.productName.join(',')+'<i class="close" name="productName"></i></li>');
                    s.productPack.length  && $ar.push('<li>'+s.productPack.join(',')+'<i class="close" name="productPack"></i></li>');
                    s.saleZone.length     && $ar.push('<li>'+f(s.saleZone)+'<i class="close" name="saleZone"></i></li>');
                    s.provinceName.length && $ar.push('<li>'+s.provinceName.join(',')+'<i class="close" name="provinceName"></i></li>');
                    s.cityName.length     && $ar.push('<li>'+s.cityName.join(',')+'<i class="close" name="cityName"></i></li>');
                    $li.html($ar.join(''));
                }
            });

            // 只做一件事 监控值的变化 去初始化multiselect 很耗性能
            scope.$watch('productBrand', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='productBrand']");
                    $select.multiselect('select', n);
                }
            });
            scope.$watch('productName', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='productName']");
                    $select.multiselect('select', n);
                }
            });
            scope.$watch('productPack', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='productPack']");
                    $select.multiselect('select', n);
                }
            });
            scope.$watch('saleZone', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='saleZone']");
                    $select.multiselect('select', n);
                }
            });
            scope.$watch('provinceName', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='provinceName']");
                    $select.multiselect('select', n);
                }
            });
            scope.$watch('cityName', function (n, o) {
                if (n !== o) {
                    var $select = $(".multi [name='cityName']");
                    $select.multiselect('select', n);
                }
            });

            // 事件代理
            $li.on('click', 'li>i.close', function (e) {
                var name = e.target.attributes.name.value;
                scope[name] = '';
                name == 'startTime' ?
                (scope.startHour = '') :
                name == 'endTime' ?
                (scope.endHour = '') : '';
                scope.$apply();
            });
        }
        return defineObj;
    };

    nguimultisearch.directive('saMultisearch', ['util', 'mAjax', 'dateFormatFilter', multisearchFn]);
});