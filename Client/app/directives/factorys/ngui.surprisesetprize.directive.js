/**
 * Author: Kuang
 * Create Date: 2017-07-29
 * Description: surprisesetprize
 */

define([], function () {
    var surprisesetprize = angular.module('ngui.surprisesetprize', []);

    var surprisesetprizeFn = function ($rootScope, $http, $compile, $timeout, util, numberFormat, hbpriceFormat, decimalFormat) {
        var defaults = { //默认配置
            tpl: '/surprisesetprize.tpl.html',
            chooseNum: 0,
            firstornot: false,
            dcList: {}
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

            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'myThanks']);

            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'myThanks']);
            }, true);

            var that_scope = angular.element('.all-template-config-wrap').scope();
            if (that_scope.activityCode) {
                scope.disabled = true;
                // 渲染已编辑奖项
                var dcList = that_scope.conf.data.dcList;
                scope.dcList = that_scope.conf.data.dcList;
                if (scope.dcList.INVOLVE && scope.dcList.INVOLVE.length > 0) {
                    scope.myThanks = true;
                }
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
                        hasLeft: true, //是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                        scope: angular.element(e.target).scope()
                    }

                    scope.$emit('fromActivityConfigtoChooseProduct', event, data);

                    scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                    scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                } else {
                    alert('请先选择投放的品牌和规格！')
                }
            })

            // 红包模板列表
            $('#surprisesetprize').on('click', '.show-hb-list', function (e) {
                if (scope.disabled) {
                    return
                }
                var that_scope = angular.element('.select-brand').scope();
                if (that_scope.selectSpecificationVal != '') {
                    $(e.target).next().trigger('click');
                    var data = {
                        metraType: 'redpack',
                        // supplierCode: that_scope.selectCompanyVal,
                        brandCodes: that_scope.selectBrandVal,//
                        unitCodes: that_scope.selectSpecificationVal,
                        status: 1,//礼品、红包池状态。0-停用；1-正常,
                        hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                    }
                    scope.$emit('fromActivityConfigtoChooseHb', event, data);
                    scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                    scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                } else {
                    alert('请先选择投放的品牌和规格！')
                }
            })

            // 积分模板列表
            $('#surprisesetprize').on('click', '.show-jf-list', function (e) {
                if (scope.disabled) {
                    return
                }
                var that_scope = angular.element('.select-brand').scope();
                if (that_scope.selectSpecificationVal != '') {
                    $(e.target).next().trigger('click');
                    var data = {
                        metraType: 'integral',
                        // supplierCode: that_scope.selectCompanyVal,
                        brandCodes: that_scope.selectBrandVal,//
                        unitCodes: that_scope.selectSpecificationVal,
                        status: 1,//礼品、红包池状态。0-停用；1-正常,
                        hasLeft: true//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                    }
                    scope.$emit('fromActivityConfigtoChooseJF', event, data);
                    scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                    scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                    scope.thanksornot = $(e.target).parents('.gotoset').hasClass('thanks-draw-wrap');
                } else {
                    alert('请先选择投放的品牌和规格！')
                }
            })

            // 新增奖品
            $('#surprisesetprize').on('click', '.create-prize-btn', function (e) {
                if (scope.disabled) {
                    return
                }
                var add_dom = $compile($('#non-special-prize').html())(scope.$new());
                $(e.target).prev('.ready-set').find('.create-part').append(add_dom)
            })

            // 删除奖品
            scope.close = function (e) {
                if (!scope.disabled) {
                    var $target = $(e.target);
                    if ($target.hasClass('close')) {
                        $target.parent().remove();
                    }
                } else {
                    return
                }
            }

            // 红包增库
            $('#surprisesetprize').on('click', '.add-hb-stock', function(e){
                // 把礼品id传到controller
                var id = $(e.target).parents('.draw-prize-wrap').data('id');
                // 把红包id传到controller
                var data = {id: id};
                scope.$emit('hbaddstockid', event, data)
            })

            // 固定金额、随机金额切换
            scope.changeTab = function (e) {
                if (scope.disabled) {
                    return
                }
                var $target = $(e.target);
                if ($target.hasClass('circle-tick')) {
                    // 清空已填写
                    var parentsDrawPrizeWrap = $target.parents('.draw-prize-wrap')[0];
                    parentsDrawPrizeWrap.dataset.id = '';
                    parentsDrawPrizeWrap.dataset.giftPic = '';
                    parentsDrawPrizeWrap.dataset.giftType = '';
                    parentsDrawPrizeWrap.dataset.name = '';
                    parentsDrawPrizeWrap.dataset.integralPool = '';
                    $(parentsDrawPrizeWrap).find('.radio-res-wrap input').val('');
                    $(parentsDrawPrizeWrap).find('input[type="checkbox"]').prop('checked', false);
                    $(parentsDrawPrizeWrap).find('.sendscore').addClass('hidden');

                    $target.addClass('active').parent().siblings().children('.circle-tick').removeClass('active');
                    var num = $target.parents('.radio-group').index();
                    $target.parents('.radio-wrap').next().children().eq(num).removeClass('hidden').siblings().addClass('hidden');

                    var giftpack = $(parentsDrawPrizeWrap).find('.giftpack');
                    if (angular.element($(giftpack)).scope() && angular.element($(giftpack)).scope().giftpackConf) {
                      angular.element($(giftpack)).scope().giftpackConf.list = [];
                    }
                }

                if ($target.hasClass('circle-money-tick')) {
                    $target.addClass('active').parents('.hb-money-wrap').siblings().children('.circle-money-tick').removeClass('active').siblings().val('').prop('readonly', true);
                    $target.siblings().prop('readonly', false)
                }
            }

            $('#surprisesetprize').on('keyup', '.hbdecimal', function (event) {
                hbpriceFormat.hbpricenumber(event);
            })

            $('#surprisesetprize').on('blur', '.decimal, .hbdecimal', function (event) {
                if (event.target.value) {
                    event.target.value = parseFloat(event.target.value);
                } else {
                    event.target.value == ''
                }
            })

            scope.notminusnotzero = function (event) {
                numberFormat.notminusnotzero(event)
            }

            // 勾选积分池
            $('#surprisesetprize').on('click', '.tickcheckbox', function (e) {
                if ($(e.target).prop('checked')) {
                    $(e.target).siblings('.sendscore').removeClass('hidden')
                } else {
                    $(e.target).siblings('.sendscore').addClass('hidden')
                }
            })
        }

        return defineObj;
    }

    surprisesetprize.directive('saSurprisesetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', surprisesetprizeFn]);
})
