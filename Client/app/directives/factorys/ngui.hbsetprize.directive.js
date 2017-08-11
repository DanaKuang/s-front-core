/**
 * Author: Kuang
 * Create Date: 2017-07-29
 * Description: hbsetprize 微信红包创建-奖项设置
 */

define([], function () {
    var hbsetprize = angular.module('ngui.hbsetprize', []);

    var hbsetprizeFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/hbsetprize.tpl.html',
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

            scope.$watch('disabled', function(n, o, s) {
                if (n != o) {
                    scope.disabled = n;
                }
            })

            var that_scope = angular.element('.all-template-config-wrap').scope();
            if (that_scope.activityCode) {
                scope.disabled = true;                
                // 编辑
                var dcList = that_scope.conf.data.dcList;
                if (dcList.length != 0) {
                    if (dcList.COMMON && dcList.COMMON.length > 0) {
                        // 普通奖品
                        var _non_wrap_html = '';
                        dcList.COMMON.forEach(function(n, index){
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

                            _non_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="number" disabled value="' + n.probability + '" class="chance"></div><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><input checked="checked" type="radio" class="active" value="微信红包" disabled><label for="">微信红包</label></div></div><div class="radio-res-wrap"><div class="hb hb-res"><div class="configuration-item"><button class="btn btn-default add-prize show-hb-list" data-toggle="modal" data-target=".create-hbProduct-modal" disabled>+选择红包模板</button>' + hbmoney_html + '</div><div class="configuration-item"><input type="number" class="money" placeholder="请填写奖金总数" disabled value="' + n.redTotalMoney + '"></div><div class="configuration-item"><input type="number" class="hbnumber" placeholder="请填写奖金数量" disabled value="' + n.redNum + '">' + score_html + '</div></div></div></div><i class="close">×</i></div>';
                        })
                        $('.non-first-draw-wrap').find('.ready-set').html(_non_wrap_html);
                    }
                    if (dcList.FIRST_LOTTERY_BE_WON && dcList.FIRST_LOTTERY_BE_WON.length  > 0) {
                        // 首抽必中
                        scope.myVar = true;
                        $('.first-draw-cbox').prop('checked', true);
                        var _first_wrap_html = '';
                        dcList.FIRST_LOTTERY_BE_WON.forEach(function(n, index) {
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

                            _first_wrap_html += '<div class="draw-prize-wrap" data-id="'+ n.awardCode +'" data-gift-pic="' + n.awardPicUrl + '" data-name="' + n.awardName + '" data-gift-type="' + n.awardType + '"><div class="prize-config border-box"><div class="configuration-item"><input type="text" class="prizename" disabled value="' + n.prizeName + '"></div><div class="configuration-item radio-wrap"><div class="radio-group"><input checked="true" type="radio" value="微信红包" class="active" disabled><label for="">微信红包</label></div></div><div class="radio-res-wrap"><div class="hb hb-res"><div class="configuration-item"><button class="btn btn-default add-prize show-hb-list" data-toggle="modal" data-target=".create-hbProduct-modal" disabled>+选择红包模板</button>' + hbmoney_html + '</div><div class="configuration-item"><input type="number" class="money" placeholder="请填写奖金总数" disabled value="' + n.redTotalMoney + '"><button class="btn btn-default add-inventory add-hb-stock" data-toggle="modal" data-target=".add-hbstock-pop">增库</button></div><div class="configuration-item"><input type="number" class="hbnumber" placeholder="请填写奖金数量" disabled value="' + n.redNum + '">' + score_html + '</div></div></div></div><i class="close">×</i></div>'
                        })
                        $('.first-draw-prize-wrap').find('.ready-set').html(_first_wrap_html)
                    }
                }
            }

            // 红包模板列表
            $('#sethbPrize').on('click', '.show-hb-list', function (e) {
                var that_scope = angular.element('.select-brand').scope();
                var data = {
                    metraType: 'redpack',
                    // supplierCode: that_scope.selectCompanyVal,
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

            // 红包增库
            $('#sethbPrize').on('click', '.add-hb-stock', function(e){
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
                if ($target.hasClass('circle-money-tick')) {
                   $target.addClass('active').parents('.hb-money-wrap').siblings().children('.circle-money-tick').removeClass('active').siblings().val('').prop('readonly', true);
                   $target.siblings().prop('readonly', false)
                }
            }

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

            // 非多个0，非负数的数字校验
            scope.notminusnotzero = function (e) {
                var val = e.target.value;
                if (numReg.test(val)) {
                    if (val) {
                        if (val < 0) {
                            e.target.value = 0
                        } else {
                            e.target.value = deletezero(val);
                        }
                    }
                } else {
                    e.target.value = 0
                }
            }

            function deletezero(str) {
                if (str.length > 1) {
                    if (str[0] === '0') {
                        str = str.substr(1);
                        deletezero(str)
                    } else {
                        return str
                    }
                } else {
                    return str
                }
            }
        }
        return defineObj;
    }

    hbsetprize.directive('saHbsetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', hbsetprizeFn]);
})
