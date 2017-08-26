/**
 * Author: Kuang
 * Create Date: 2017-07-25
 * Description: setprize
 */

define([], function () {
    var setprize = angular.module('ngui.setprize', []);

    var setprizeFn = function ($rootScope, $http, $compile, $timeout, util, numberFormat, hbpriceFormat, decimalFormat) {
        var defaults = { //默认配置
            tpl: '/setprize.tpl.html',
            chooseNum: 0,
            firstornot: false
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot']);
            // 监视conf变化更新 basicinfo
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot']);
            }, true);

            var that_scope = angular.element('.all-template-config-wrap').scope();
            if (that_scope.activityCode) {
                // 编辑
                scope.disabled = true;
                var dcList = that_scope.conf.data.dcList;

                var gifthtml = $('#gifthtml').html();
                var hbhtml = $('#hbhtml').html();
                var jfhtml = $('#jfhtml').html();

                var specialgifthtml = $('#specialgifthtml').html();
                var specialhbhtml = $('#specialhbhtml').html();

                if (dcList) {
                    if (dcList.COMMON && dcList.COMMON.length > 0) {
                        // 普通奖品
                        var _non_wrap_html = '';
                        dcList.COMMON.forEach(function (n, index) {
                            if (n.awardType == 3) {
                                // 红包
                                if (n.score > 0) {
                                // 赠送积分
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled checked="true"><label for="">同时赠送积分</label><input type="number" class="score" disabled value="' + n.score + '">积分</div>';
                                } else {
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled><label for="">同时赠送积分</label><input type="number" class="score" disabled>积分</div>';
                                }
                                if (n.bigred == n.minred) {
                                    // 固定金额
                                    var hbmoney_html = '<div class="hb-two-one"><div class="random-hb hb-money-wrap"><div class="circle-money-tick"><i class="circle"></i>随机金额</div><input type="number" class="min" readonly="true" disabled>元 —— <input type="number" class="max" readonly="true" disabled>元</div><div class="fixed-hb hb-money-wrap"><div class="circle-money-tick active"><i class="circle"></i>固定金额</div><input type="number" class="fixed" readonly="true" disabled value="' + n.minred + '">元</div></div>'
                                } else {
                                    var hbmoney_html = '<div class="hb-two-one"><div class="random-hb hb-money-wrap"><div class="circle-money-tick active"><i class="circle"></i>随机金额</div><input type="number" class="min" readonly="true" disabled value="'+ n.minred +'">元 —— <input type="number" class="max" readonly="true" disabled value="'+ n.bigred +'">元</div><div class="fixed-hb hb-money-wrap"><div class="circle-money-tick"><i class="circle"></i>固定金额</div><input type="number" class="fixed" readonly="true" disabled>元</div></div>'
                                }

                                _non_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="number" class="chance" disabled value="' + n.probability + '"></div><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap">' + gifthtml + '<div class="hb radio-res"><div class="configuration-item"><button class="btn btn-default add-prize show-hb-list" data-toggle="modal" data-target=".create-hbProduct-modal" disabled>+选择红包模板</button>' + hbmoney_html + '</div><div class="configuration-item"><input type="number" class="money" placeholder="请填写奖金总数" disabled value="' + n.redTotalMoney + '"></div><div class="configuration-item"><input type="number" class="hbnumber" placeholder="请填写奖金数量" disabled value="' + n.redNum + '">' + score_html + '</div></div>' + jfhtml + '</div></div><i class="close">×</i></div>';

                            } else if (n.awardType == 6) {
                                // 积分
                                _non_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="number" class="chance" disabled value="' + n.probability + '"></div><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap">' + gifthtml + hbhtml + '<div class="jf radio-res"><div class="configuration-item"><input type="number" class="score" placeholder="请输入数字" value="' + n.score + '" disabled></div><div class="configuration-item"><input type="number" class="number" placeholder="请输入数字" value="' + n.totalNum + '" disabled></div></div></div></div><i class="close">×</i></div>';

                            } else {
                                // 礼品
                                if (n.score > 0) {
                                // 赠送积分
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled checked="true"><label for="">同时赠送积分</label><input type="number" class="score" disabled value="' + n.score + '">积分</div>';
                                } else {
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled><label for="">同时赠送积分</label><input type="number" class="score" disabled>积分</div>';
                                }
                                _non_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="number" class="chance" disabled value="' + n.probability + '"></div><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap"><div class="gift radio-res"><div class="configuration-item"><button class="btn btn-default add-prize show-product-list" data-toggle="modal" data-target=".create-realProduct-modal" disabled>+选择产品</button><div class="prize-img-preview"><img src="' + n.awardPicUrl + '" alt=""></div></div><div class="configuration-item"><input type="number" class="number" placeholder="请输入数字" value="' + n.totalNum + '" disabled>' + score_html + '</div></div>' + hbhtml + jfhtml + '</div></div><i class="close">×</i></div>';
                            }
                            $('.non-first-draw-wrap').find('.ready-set').html(_non_wrap_html);
                        })
                    }
                    if (dcList.FIRST_LOTTERY_BE_WON && dcList.FIRST_LOTTERY_BE_WON.length  > 0) {
                        scope.myVar = true;
                        $('.first-draw-cbox').prop('checked', true);
                        var first_wrap_html = '';
                        dcList.FIRST_LOTTERY_BE_WON.forEach(function (n, index) {
                            if (n.awardType == 3) {
                                // 红包
                                if (n.score > 0) {
                                // 赠送积分
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled checked="true"><label for="">同时赠送积分</label><input type="number" class="score" disabled value="' + n.score + '">积分</div>';
                                } else {
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled><label for="">同时赠送积分</label><input type="number" class="score" disabled>积分</div>';
                                }
                                if (n.bigred == n.minred) {
                                    // 固定金额
                                    var hbmoney_html = '<div class="hb-two-one"><div class="random-hb hb-money-wrap"><div class="circle-money-tick"><i class="circle"></i>随机金额</div><input type="number" class="min" readonly="true" disabled>元 —— <input type="number" class="max" readonly="true" disabled>元</div><div class="fixed-hb hb-money-wrap"><div class="circle-money-tick active"><i class="circle"></i>固定金额</div><input type="number" class="fixed" readonly="true" disabled value="' + n.minred + '">元</div></div>'
                                } else {
                                    var hbmoney_html = '<div class="hb-two-one"><div class="random-hb hb-money-wrap"><div class="circle-money-tick active"><i class="circle"></i>随机金额</div><input type="number" class="min" readonly="true" disabled value="'+ n.minred +'">元 —— <input type="number" class="max" readonly="true" disabled value="'+ n.bigred +'">元</div><div class="fixed-hb hb-money-wrap"><div class="circle-money-tick"><i class="circle"></i>固定金额</div><input type="number" class="fixed" readonly="true" disabled>元</div></div>'
                                }

                                first_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap">' + specialgifthtml + '<div class="hb radio-res"><div class="configuration-item"><button class="btn btn-default add-prize show-hb-list" data-toggle="modal" data-target=".create-hbProduct-modal" disabled>+选择红包模板</button>' + hbmoney_html + '</div><div class="configuration-item"><input type="number" class="money" placeholder="请填写奖金总数" disabled value="' + n.redTotalMoney + '"> <button class="btn btn-default add-inventory add-hb-stock" data-toggle="modal" data-target=".add-hbstock-pop">增库</button></div><div class="configuration-item"><input type="number" class="hbnumber" placeholder="请填写奖金数量" disabled value="' + n.redNum + '">' + score_html + '</div></div>' + jfhtml + '</div></div><i class="close">×</i></div>';

                            } else if (n.awardType == 6) {
                                // 积分
                                first_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap">' + specialgifthtml + specialhbhtml + '<div class="jf radio-res"><div class="configuration-item"><input type="number" class="score" placeholder="请输入数字" value="' + n.score + '" disabled></div><div class="configuration-item"><input type="number" class="number" placeholder="请输入数字" value="' + n.totalNum + '" disabled></div></div></div></div><i class="close">×</i></div>'

                            } else {
                                // 礼品
                                if (n.score > 0) {
                                // 赠送积分
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled checked="true"><label for="">同时赠送积分</label><input type="number" class="score" disabled value="' + n.score + '">积分</div>';
                                } else {
                                    var score_html = '<div class="present-integral"><input type="checkbox" class="tickcheckbox" disabled><label for="">同时赠送积分</label><input type="number" class="score" disabled>积分</div>';
                                }
                                first_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><div class="circle-tick active"><i class="circle"></i>礼品</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>微信红包</div></div><div class="radio-group"><div class="circle-tick"><i class="circle"></i>积分</div></div></div><div class="radio-res-wrap"><div class="gift radio-res"><div class="configuration-item"><button class="btn btn-default add-prize show-product-list" data-toggle="modal" data-target=".create-realProduct-modal" disabled>+选择产品</button><div class="prize-img-preview"><img src="' + n.awardPicUrl + '" alt=""></div></div><div class="configuration-item"><input type="number" class="number" placeholder="请输入数字" value="' + n.totalNum + '" disabled> <button class="btn btn-default add-inventory add-gift-stock" data-toggle="modal" data-target=".add-giftstock-pop">增库</button>' + score_html + '</div></div>' + specialhbhtml + jfhtml + '</div></div><i class="close">×</i></div>';
                            }

                            $('.first-draw-prize-wrap').find('.ready-set').html(first_wrap_html);
                        })
                    }
                }
            }

            // 产品模板列表
            $('#setprize').on('click', '.show-product-list', function (e) {
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

            // 红包模板列表
            $('#setprize').on('click', '.show-hb-list', function (e) {
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
            $('#setprize').on('click', '.show-jf-list', function (e) {
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
                } else {
                    alert('请先选择投放的品牌和规格！')
                }
            })

            // 新增奖品
            scope.createNewPrize = function (e) {
                if (scope.disabled) {
                    return
                }
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
                if (scope.disabled) {
                    return
                }
                var $target = $(e.target);
                if ($target.hasClass('close')) {
                    $target.parent().remove();
                }
            }

            // tab切换，微信红包金额切换
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
                    $(parentsDrawPrizeWrap).find('.prize-img-preview img').attr('src', '');
                    $(parentsDrawPrizeWrap).find('.radio-res-wrap input').val('');
                    $(parentsDrawPrizeWrap).find('input[type="checkbox"]').prop('checked', false)

                    $target.addClass('active').parent().siblings().children('.circle-tick').removeClass('active');
                    var num = $target.parents('.radio-group').index();
                    $target.parents('.radio-wrap').next().children().eq(num).removeClass('hidden').siblings().addClass('hidden');
                }
                if ($target.hasClass('circle-money-tick')) {
                    $target.addClass('active').parents('.hb-money-wrap').siblings().children('.circle-money-tick').removeClass('active').siblings().val('').prop('readonly', true);
                    $target.siblings().prop('readonly', false)
                }
            }

            // 礼品增库
            $('#setprize').on('click', '.add-gift-stock', function(e){
                var id = $(e.target).parents('.draw-prize-wrap').data('id');
                var drawPrizeWrap_index = $(e.target).parents('.draw-prize-wrap').index();
                // 把红包id传到controller
                var data = {
                    id: id,
                    index: drawPrizeWrap_index
                };
                scope.$emit('giftaddstockid', event, data)
            })

            // 红包增库
            $('#setprize').on('click', '.add-hb-stock', function(e){
                // 把礼品id传到controller
                var id = $(e.target).parents('.draw-prize-wrap').data('id');
                var drawPrizeWrap_index = $(e.target).parents('.draw-prize-wrap').index();
                // 把红包id传到controller
                var data = {
                    id: id, 
                    index: drawPrizeWrap_index
                };
                scope.$emit('hbaddstockid', event, data)
            })

            $('#setprize').on('keyup', '.decimal', function (event) {
                decimalFormat.decimalnumber(event);
            })

            $('#setprize').on('keyup', '.hbdecimal', function (event) {
                hbpriceFormat.hbpricenumber(event);
            })

            $('#setprize').on('blur', '.decimal, .hbdecimal', function (event) {
                if (event.target.value) {
                    event.target.value = parseFloat(event.target.value);
                } else {
                    event.target.value == ''
                }
            })

            scope.notminusnotzero = function (event) {
                numberFormat.notminusnotzero(event)
            }

            // // 勾选积分池
            // $('#setprize').on('click', '.tickcheckbox', function (e) {
            //     if ($(e.target).prop('checked')) {
            //         $(e.target).siblings('.sendscore').removeClass('hidden')
            //     } else {
            //         $(e.target).siblings('.sendscore').addClass('hidden')
            //     }
            // })
        }
        return defineObj;
    }

    setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', setprizeFn]);
})
