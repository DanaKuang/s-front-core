/**
 * Author: Kuang
 * Create Date: 2017-09-05
 * Description: giftpack
 */

define([], function () {
    var giftpack = angular.module('ngui.giftpack', []);

    var giftpackFn = function ($rootScope, $http, $compile, $timeout, util, numberFormat, hbpriceFormat, decimalFormat) {
        var defaults = { //默认配置
            tpl: '/giftpack.tpl.html',
            list: []
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list']);

            // 监视conf变化更新page
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list']);

                // 一开始进入页面的时候scope.conf是undefined
                if (scope.conf) {
                    
                }

                var that_scope = angular.element('.all-template-config-wrap').scope();
                if (that_scope.activityCode) {
                    scope.disabled = true;
                }

                // 产品模板列表
                $('#surprisesetprize').on('click', '.show-product-list', function (e) {
                    if (scope.disabled) {
                        return
                    }
                    var that_scope = angular.element('.select-brand').scope();
                    if (that_scope.selectSpecificationVal != '') {
                        $(e.target).next().trigger('click');
                        var data = {
                            metraType: 'gift',
                            // supplierCode: that_scope.selectCompanyVal,
                            brandCodes: that_scope.selectBrandVal,//品牌编码。支持多个，使用英文逗号分隔,
                            unitCodes: that_scope.selectSpecificationVal,
                            // businessType: 1,//礼品物料类型，1-实物礼品；其它值-虚拟礼品。红包此字段未使用,
                            status: 1,//礼品、红包池状态。0-停用；1-正常,
                            hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                        }
                        scope.$emit('fromActivityConfigtoChooseProduct', event, data);

                        scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                        scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                    } else {
                        alert('请先选择投放的品牌和规格！')
                    }
                })

                // 监听list变化
                var realproductchooseScope = angular.element('.gift-realproduct-choose').scope();
                console.log(realproductchooseScope.listitem);
                if (realproductchooseScope.listitem != undefined) {
                    scope.list.push(realproductchooseScope.listitem);
                }
                
            }, true);

        }
        return defineObj;
    }

    giftpack.directive('saGiftpack', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', giftpackFn]);
})
