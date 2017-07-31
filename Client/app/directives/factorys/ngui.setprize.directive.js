/**
 * Author: Kuang
 * Create Date: 2017-07-25
 * Description: setprize
 */

define([], function () {
    var setprize = angular.module('ngui.setprize', []);

    var setprizeFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/setprize.tpl.html',
            chooseNum: 0,
            firstornot: false,
            specialAwards: [],
            specialAwardPics: [],
            specialAwardNums: [],
            specialAwardScores: [],
            chance: []
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'specialAwards', 'specialAwardPics', 'specialAwardNums', 'specialAwardScores', 'chance']);
            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'specialAwards', 'specialAwardPics', 'specialAwardNums', 'specialAwardScores', 'chance']);
            }, true);

            // 产品模板列表
            $('#setprize').on('click', '.show-product-list', function (e) {
                var that_scope = angular.element('.select-company').scope();
                var data = {
                    metraType: 'gift',
                    supplierCode: that_scope.selectCompanyVal,
                    brandCodes: that_scope.selectBrandVal,//品牌编码。支持多个，使用英文逗号分隔,
                    businessType: 1,//礼品物料类型，1-实物礼品；其它值-虚拟礼品。红包此字段未使用,
                    status: 1,//礼品、红包池状态。0-停用；1-正常,
                    hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                }
                scope.$emit('fromActivityConfigtoChooseProduct', event, data);

                scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
            })

            // 红包模板列表
            $('#setprize').on('click', '.show-hb-list', function (e) {
                var that_scope = angular.element('.select-company').scope();
                var data = {
                    metraType: 'redpack',
                    supplierCode: that_scope.selectCompanyVal,
                    brandCodes: that_scope.selectBrandVal,//
                    status: 1,//礼品、红包池状态。0-停用；1-正常,
                    hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                }
                scope.$emit('fromActivityConfigtoChooseHb', event, data);

                scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
            })

            // 新增奖品
            scope.createNewPrize = function (e) {
                if ($(e.target).parent().hasClass('first-draw-prize-wrap')) {
                    var special_dom = $('#special-prize').html();
                    $(e.target).prev('.ready-set').append(special_dom)
                } else {
                    var non_special_dom = $('#non-special-prize').html();
                    $(e.target).prev('.ready-set').append(non_special_dom)
                }
            }

            // 删除奖品
            scope.close = function (e) {
                var $target = $(e.target);
                if ($target.hasClass('close')) {
                    $target.parent().remove();
                }
            }

            // tab切换，微信红包金额切换
            scope.changeTab = function (e) {
                var $target = $(e.target);
                if ($target.hasClass('circle-tick')) {
                    $target.addClass('active').parent().siblings().children('.circle-tick').removeClass('active');
                    var num = $target.parents('.radio-group').index();
                    $target.parents('.radio-wrap').next().children().eq(num).removeClass('hidden').siblings().addClass('hidden');
                }
                if ($target.hasClass('circle-money-tick')) {
                    $target.addClass('active').parents('.hb-money-wrap').siblings().children('.circle-money-tick').removeClass('active');
                }
            }

            // 礼品增库
            $('#setprize').on('click', '.add-gift-stock', function(e){
                var id = $(e.target).parents('.draw-prize-wrap').data('id');
                // 把红包id传到controller
                var data = {id: id};
                scope.$emit('giftaddstockid', event, data)
            })

            // 红包增库
            $('#setprize').on('click', '.add-hb-stock', function(e){
                // 把礼品id传到controller
                var id = $(e.target).parents('.draw-prize-wrap').data('id');
                // 把红包id传到controller
                var data = {id: id};
                scope.$emit('hbaddstockid', event, data)
            })

        }

        return defineObj;
    }

    setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', setprizeFn]);
})
