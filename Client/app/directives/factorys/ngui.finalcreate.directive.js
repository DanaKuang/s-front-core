/**
 * Author: Kuang
 * Create Date: 2017-07-31
 * Description: finalcreate
*/

define([], function () {
    var finalcreate = angular.module('ngui.finalcreate', []);

    var finalcreateFn = function ($rootScope, $http, $compile, $timeout, util) {
        var defaults = { //默认配置
            tpl: '/finalcreate.tpl.html'
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
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);

            // 监视conf变化更新 commonactivity
            scope.$watch('conf', function () {
                // 属性赋值
                util.uiExtend(scope, defaults, attrs, (scope.conf || {}), []);
            }, true);

            var that_scope = angular.element('.all-template-config-wrap').scope();
            if (that_scope.activityCode) {
                // 编辑
                scope.disabled = true;
                scope.status = that_scope.conf.data.activity.status;
                if (status == 1) {
                    // 已上线
                    $('.online').prop('checked',true)
                }
            }

            scope.cancelActivityBuild = function() {
                var r = confirm('确定要取消吗？')
                if (r == true) {
                    scope.$emit('popback', event, {}); 
                } else {
                    return
                }
            }

            // 保存活动
            var scopeVariable = {};
            scope.updateActivity = function () {
                bigVerify()
            }

            function bigVerify() {
                // $('.wrong-tip').addClass('hidden');

                scopeVariable._basicScope = angular.element('.basicinfo').scope(); //基本信息
                scopeVariable._participateScope = angular.element('.participate-integral').scope(); //参与设置
                scopeVariable._launchScope = angular.element('.select-brand').scope(); //投放设置
                scopeVariable._setPrizeScope = angular.element('.ready-set').scope(); // 奖项设置
                scopeVariable._drawPrizeScope = angular.element('.draw-prize').scope(); // 彩蛋的 中奖设置

                scopeVariable.activityAwards = [];
                scopeVariable.specialerror = false;
                scopeVariable.commonerror = false;
                scopeVariable.finalerror = false;
            
                // 彩蛋奖品
                if (scopeVariable._drawPrizeScope) {
                    var caidanerror = false;
                    var caidanAward = {};
                    processCaidanDraw(scopeVariable._drawPrizeScope, caidanAward, caidanerror);
                    // 彩蛋的中奖fn
                    function processCaidanDraw(_drawPrizeScope, caidanAward, caidanerror) {
                        caidanAward.sduration = _drawPrizeScope.startHour;
                        caidanAward.eduration = _drawPrizeScope.endHour;
                        if (_drawPrizeScope.intervalHourperson != 0) {
                            caidanAward.duration = _drawPrizeScope.intervalHour;
                            caidanAward.playPerson = _drawPrizeScope.intervalHourperson;
                        }
                        caidanAward.adcodes = Array.isArray(_drawPrizeScope.drawAreaVal) ? _drawPrizeScope.drawAreaVal.join(',') : _drawPrizeScope.drawAreaVal || '';
                        caidanAward.adnames = $('.draw-area').find('.multiselect-selected-text').html() && $('.draw-area').find('.multiselect-selected-text').html().toString();

                        if (_drawPrizeScope.myPlus) {
                            caidanAward.condition = _drawPrizeScope.plusval;
                            var index = $('[ng-model="plusval"]')[0].selectedIndex;
                            caidanAward.conditionName = $('[ng-model="plusval"] option').eq(index).text();
                            if (!caidanAward.condition) {
                                caidanerror = true;
                                $('.plus').children('.wrong-tip').removeClass('hidden');
                            }
                        } else {
                            caidanAward.probability = parseFloat(_drawPrizeScope.drawChance);
                            if (!caidanAward.probability) {
                                caidanerror = true;
                                $('.plus').children('.wrong-tip').removeClass('hidden');
                            }
                        }
                        if (!caidanAward.sduration || !caidanAward.eduration || !caidanAward.adcodes) {
                            caidanerror = true;
                            $('.plus').children('.wrong-tip').removeClass('hidden');
                        }
                    }
                }

                if (that_scope.activityCode) {
                    // 编辑模式下
                    if (scopeVariable._setPrizeScope.myVar) {
                        // 特殊
                        setPrize('special', true)
                    }
                    if (scopeVariable._setPrizeScope.myThanks) {
                        // 参与奖
                        setPrize('thanks', true)
                    }
                    // 普通奖品必需填写
                    setPrize('common', true)

                } else {
                    // 新建模式下
                    if (scopeVariable._setPrizeScope.myVar) {
                        // 特殊
                        setPrize('special')
                    }
                    if (scopeVariable._setPrizeScope.myThanks) {
                        // 参与奖
                        setPrize('thanks')
                    }
                    // 普通奖品必需填写
                    setPrize('common')
                }

                // 特殊 & 普通奖项设置fn 
                function setPrize(tag, editornot) {
                    if (editornot) {
                        if (tag === 'special') {
                            // 特殊奖品
                            var prizeDomList = $('.first-draw-prize-wrap').find('.ready-set .edit-part').children();
                        } else if (tag === 'common') {
                            // 普通奖品
                            var prizeDomList = $('.non-first-draw-wrap').find('.ready-set .edit-part').children();
                        } else {
                            var prizeDomList = $('.thanks-draw-wrap').find('.ready-set .edit-part').children();
                        }
                    } else {
                        if (tag === 'special') {
                            // 特殊奖品
                            var prizeDomList = $('.first-draw-prize-wrap').find('.ready-set .create-part').children();
                        } else if (tag === 'common') {
                            // 普通奖品
                            var prizeDomList = $('.non-first-draw-wrap').find('.ready-set .create-part').children();
                        } else {
                            var prizeDomList = $('.thanks-draw-wrap').find('.ready-set .create-part').children();
                        }
                    }

                    var prizeDomList_len = prizeDomList.length;
                    var prizeDomList_arr = Array.apply(0, Array(prizeDomList_len)).map(function(item, index){
                        return index
                    })

                    if (tag === 'special') {
                        // 特殊奖品
                        processPrizeArr(prizeDomList_arr, prizeDomList, 'special')
                    } else if (tag === 'common') {
                        // 普通奖品
                        processPrizeArr(prizeDomList_arr, prizeDomList, 'common')
                    } else {
                        // 参与奖品
                        processPrizeArr(prizeDomList_arr, prizeDomList, 'thanks')
                    }
                }

                // 具体-处理奖项数组
                function processPrizeArr(prizeDomList_arr, prizeDomList, type) {
                    prizeDomList_arr.forEach(function (n, index) {
                        var item = prizeDomList.eq(n);
                        if (item.parents('.sethbprize').length != 0) {
                            // 微信红包专属活动
                            var radio_res_item = item.find('.hb-res');
                        } else {
                            // 通用3选1
                            var num = item.find('.radio-wrap').find('.active').parent().index();
                            var radio_res_item = item.find('.radio-res-wrap').children().eq(num);
                        }

                        var ActivityPageAward = {};
                        if (type === 'special') {
                            ActivityPageAward.special = 1;
                        } else if (type == 'common') {
                            ActivityPageAward.special = 0;
                        } else {
                            // 参与奖
                            ActivityPageAward.special = -1;
                        }

                        ActivityPageAward.probability = item.find('.chance').val() || ''; //特殊奖品没有概率设置
                        ActivityPageAward.prizeName = item.find('.prizename').val() || '';
                        ActivityPageAward.details = []; //具体奖品数组

                        // 分---礼品 & 红包、积分
                        if (radio_res_item.hasClass('gift')) {
                            // 礼品
                            var giftDomList = radio_res_item.find('.already-choose-wrap').children();
                            var giftDomList_len = giftDomList.length;
                            var giftDomList_arr = Array.apply(0, Array(giftDomList_len)).map(function(item, index){
                                return index
                            })
                            processGiftArr(giftDomList_arr, giftDomList, item, ActivityPageAward)
                        } else {
                            processSingleArr(ActivityPageAward, item, radio_res_item)
                        }

                        if (radio_res_item.hasClass('gift') || radio_res_item.hasClass('hb')) {
                            var send_scores = radio_res_item.find('.tickcheckbox');
                            if (send_scores.prop('checked')) {
                                ActivityPageAward.giveScore = 1;
                                ActivityPageAward.integralPool = item.data('integral-pool');
                                ActivityPageAward.score = radio_res_item.find('.score').val() || 0;
                                // 在这里就对赠送积分的积分池进行校验
                                if (!ActivityPageAward.integralPool) {
                                    ActivityPageAward.special ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                                    item.children('.wrong-tip').removeClass('hidden');
                                }
                            }
                        }
                        scopeVariable.activityAwards.push(ActivityPageAward);
                    })
                }

                // 处理gift里面的multiple奖品
                function processGiftArr(giftDomList_arr, giftDomList, item, ActivityPageAward) {
                    var type = 'gift';
                    if (giftDomList_arr.length > 1) {
                        ActivityPageAward.multiChoose = 1;
                    } else {
                        ActivityPageAward.multiChoose = 0;
                    }

                    giftDomList_arr.forEach(function (n, index) {
                        ActivityPageAward.details[index] = {};
                        var n = giftDomList.eq(index).find('.prize-img-preview-wrap');
                        ActivityPageAward.details[index].poolId = n[0].dataset.id || ''; 
                        ActivityPageAward.details[index].awardName = n[0].dataset.name || '';
                        ActivityPageAward.details[index].awardPicUrl = n[0].dataset.giftpic || '';
                        ActivityPageAward.details[index].awardType = n[0].dataset.gifttype;
                        ActivityPageAward.details[index].awardNums = n.find('.number').val();
                    })

                    checkerroreouspart(ActivityPageAward, type, item)
                }

                // 处理单选奖品
                function processSingleArr(ActivityPageAward, item, radio_res_item) {
                    var type = 'notgift';
                    // 红包 和 积分
                    ActivityPageAward.multiChoose = 0; 
                    ActivityPageAward.details[0] = {};
                    ActivityPageAward.details[0].awardName = item[0].dataset.name || '';
                    ActivityPageAward.details[0].awardPicUrl = '';
                    ActivityPageAward.details[0].awardNums = radio_res_item.find('.number').val();

                    // 红包总金额，最小、最大
                    if (radio_res_item.hasClass('hb')) {
                        ActivityPageAward.details[0].poolId = item[0].dataset.id; // 积分池的id是integralpool，不是这个字段
                        ActivityPageAward.details[0].awardType = 3;
                        ActivityPageAward.details[0].redTotalMoney = radio_res_item.find('.money').val();

                        if (radio_res_item.find('.circle-money-tick.active').parent().hasClass('random-hb')) {
                            ActivityPageAward.details[0].minred = radio_res_item.find('.min').val();
                            ActivityPageAward.details[0].bigred = radio_res_item.find('.max').val();
                        } else {
                            ActivityPageAward.details[0].minred = ActivityPageAward.details[0].bigred = radio_res_item.find('.fixed').val();
                        }
                    } 
                    if (radio_res_item.hasClass('jf')) {
                        ActivityPageAward.score = radio_res_item.find('.score').val() || 0;
                        ActivityPageAward.details[0].awardType = 6;
                        ActivityPageAward.details[0].poolId = item.data('integral-pool');
                    }

                    checkerroreouspart(ActivityPageAward, type, item, radio_res_item)
                }

                // 校验错误
                function checkerroreouspart(ActivityPageAward, type, item, radio_res_item ) {
                    if (type === 'gift') {
                        if (ActivityPageAward.details.length != 0) {
                            ActivityPageAward.details.forEach(function(n, index) {
                                if (!n.poolId || !n.awardNums) {
                                    ActivityPageAward.special == 1 ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                                    item.children('.wrong-tip').removeClass('hidden');
                                }
                            })
                        } else {
                            ActivityPageAward.special == 1 ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }
                    } else {
                        if (!ActivityPageAward.details[0].awardNums || !ActivityPageAward.details[0].poolId) {
                            ActivityPageAward.special == 1 ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }

                        if (radio_res_item.hasClass('hb') && (!ActivityPageAward.details[0].redTotalMoney || !ActivityPageAward.details[0].minred || !ActivityPageAward.details[0].bigred)) {
                            ActivityPageAward.special == 1 ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }
                    }

                    // 1. 奖项名称
                    if (!ActivityPageAward.prizeName) {
                        ActivityPageAward.special == 1 ? scopeVariable.specialerror = true : scopeVariable.commonerror = true;
                        item.children('.wrong-tip').removeClass('hidden');
                    }
                    // 2. 概率
                    if (ActivityPageAward.special == 0 && !scopeVariable._drawPrizeScope && !ActivityPageAward.probability) {
                        scopeVariable.commonerror = true;
                        item.children('.wrong-tip').removeClass('hidden');
                    }
                }

                // 最后整合成提交对象
                var fromSonScope = {
                    copyOfPageCode: angular.element('.all-template-config-wrap').scope().pageCode,
                    pageCode: scopeVariable._basicScope.pageCode || '',
                    activityForm: scopeVariable._basicScope.activityForm,
                    activityCode: angular.element('.all-template-config-wrap').scope().activityCode || '',
                    pageName: scopeVariable._basicScope.pageName || '',
                    activityDec: scopeVariable._basicScope.descValue || '', //活动描述
                    activityDoc: scopeVariable._basicScope.introValue || '', //活动说明
                    activityEntrance: scopeVariable._basicScope.accessUrl || '', //accessUrl
                    activityEntranceAttach: scopeVariable._basicScope.attachCode || '', // attachCode
                    idx: scopeVariable._basicScope.namePriority || 1,
                    name: scopeVariable._basicScope.nameVaule || '',
                    attachUrl: '',
                    score: scopeVariable._participateScope.nameIntegral || 0,
                    limitPer: scopeVariable._participateScope.namePerPersonDay || 0,
                    limitAll: scopeVariable._participateScope.namePerPerson || 0,
                    supplier: scopeVariable._launchScope.selectCompanyVal || '',
                    brandCode: scopeVariable._launchScope.activity ? scopeVariable._launchScope.activity.activityBrandsList.join('') : scopeVariable._launchScope.selectBrandVal || '',
                    sn: scopeVariable._launchScope.activity ? scopeVariable._launchScope.activity.activitySnSList[0].sn : scopeVariable._launchScope.selectSpecificationVal || '',
                    areaCode: scopeVariable._launchScope.selectAreaVal ? scopeVariable._launchScope.selectAreaVal.toString() : '' || '',
                    holiday: scopeVariable._launchScope.whichday || 3,
                    stime: that_scope.activityCode ? scopeVariable._launchScope.startTime : scopeVariable._launchScope.startTime + ':00',
                    etime: that_scope.activityCode ? scopeVariable._launchScope.endTime :  scopeVariable._launchScope.endTime + ':00',
                    specialCode: 'FIRST_LOTTERY_BE_WON',
                    activityAwards: scopeVariable.activityAwards,
                    caidanConfig: scopeVariable._drawPrizeScope ? caidanAward : null,
                    status: that_scope.activityCode ? that_scope.conf.data.activity.status : $('.online').prop('checked') ? 1 : 2
                }

                finalcheck(fromSonScope)
                // final校验
                function finalcheck(fromSonScope) {
                    for (var s in fromSonScope) {
                        // attachUrl, specialAwardStr 这两个可以为空
                        if (s == 'name' && fromSonScope[s] == '' ) {
                           // 活动名称没选
                           scopeVariable.finalerror = true;
                           $('.activity-name .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityEntrance' && fromSonScope[s] == '') {
                            // 活动图片未上传
                            scopeVariable.finalerror = true;
                            $('.configuration-image .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityDec' && fromSonScope[s] == '') {
                            // 活动描述没写
                            scopeVariable.finalerror = true;
                            $('.activity-desc .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityDoc' && fromSonScope[s] == '') {
                            // 活动说明没写
                            scopeVariable.finalerror = true;
                            $('.activity-intro .wrong-tip').removeClass('hidden');
                        }

                        if (!scopeVariable._drawPrizeScope) {
                            if (s == 'idx' && fromSonScope[s] == '') {
                                // 优先级没写
                                scopeVariable.finalerror = true;
                                $('.activity-priority .wrong-tip').removeClass('hidden');
                            }
                        }
                        
                        if (s == 'areaCodes' && fromSonScope[s].length == 0) {
                            // 地区没选
                            scopeVariable.finalerror = true;
                            $('.select-area .wrong-tip').removeClass('hidden');
                        }
                        if (s == 'brands' && fromSonScope[s].length == 0) {
                            // 品牌没选
                            scopeVariable.finalerror = true;
                            $('.select-brand .wrong-tip').removeClass('hidden');
                        }
                        if (s == 'sns' && fromSonScope[s].length == 0) {
                            // 规格没选
                            scopeVariable.finalerror = true;
                            $('.select-specification .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'stime' && fromSonScope[s] == '') {
                            // 开始时间没选
                            scopeVariable.finalerror = true;
                            $('.select-duration .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'etime' && fromSonScope[s] == '') {
                            // 结束时间没选
                            scopeVariable.finalerror = true;
                            $('.select-duration .wrong-tip').removeClass('hidden');
                        }
                    }
                }

                 // 提交
                if (scopeVariable._setPrizeScope.myVar) {
                    if (!scopeVariable.specialerror && !scopeVariable.commonerror && !scopeVariable.finalerror) {
                        scope.$emit('fromcommonactivity', event, fromSonScope);
                    } else {
                        alert('奖品设置有误，请核对后再提交')
                    }
                } else {
                    if (scopeVariable._drawPrizeScope) {
                        if (!scopeVariable.caidanerror && !scopeVariable.commonerror && !scopeVariable.finalerror) {
                            scope.$emit('fromcommonactivity', event, fromSonScope);
                        } else {
                            alert('奖品设置有误，请核对后再提交')
                        }
                    } else {
                        if (!scopeVariable.commonerror && !scopeVariable.finalerror) {
                            scope.$emit('fromcommonactivity', event, fromSonScope);
                        } else {
                            alert('奖品设置有误，请核对后再提交')
                        }
                    }
                }
            } 
        }

        return defineObj;
    }

    finalcreate.directive('saFinalcreate', ['$rootScope', '$http', '$compile', '$timeout', 'util', finalcreateFn]);
})
