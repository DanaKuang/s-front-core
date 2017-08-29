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
                location.reload();
            }

            // 保存活动
            scope.updateActivity = function () {
                bigVerify()
            }

            function bigVerify() {
                var _basicScope = angular.element('.basicinfo').scope(); //基本信息
                var _participateScope = angular.element('.participate-integral').scope(); //参与设置
                var _launchScope = angular.element('.select-brand').scope(); //投放设置
                var _setPrizeScope = angular.element('.ready-set').scope(); // 奖项设置
                var _drawPrizeScope = angular.element('.draw-prize').scope(); // 彩蛋的 中奖设置

                var activityAwards = [],
                    specialerror = false,
                    commonerror = false,
                    finalerror = false;
            
                // 彩蛋奖品
                if (_drawPrizeScope) {
                    var caidanerror = false;
                    var caidanAward = [];
                    processCaidanDraw(_drawPrizeScope, caidanAward, caidanerror);
                    // 彩蛋的中奖fn
                    function processCaidanDraw(_drawPrizeScope, caidanAward, caidanerror) {
                        var caidanAwardInner = {};
                        caidanAwardInner.sduration = _drawPrizeScope.startHour;
                        caidanAwardInner.eduration = _drawPrizeScope.endHour;
                        caidanAwardInner.adcodes = Array.isArray(_drawPrizeScope.drawAreaVal) ? _drawPrizeScope.drawAreaVal.join(',') : _drawPrizeScope.drawAreaVal || '';
                        if (_drawPrizeScope.myPlus) {
                            caidanAwardInner.condition = _drawPrizeScope.plusval;
                            var index = $('[ng-model="plusval"]')[0].selectedIndex;
                            caidanAwardInner.conditionName = $('[ng-model="plusval"] option').eq(index).text();
                            if (!caidanAwardInner.condition) {
                                caidanerror = true;
                                $('.plus').children('.wrong-tip').removeClass('hidden');
                            }
                        } else {
                            caidanAwardInner.probability = _drawPrizeScope.drawChance;
                            if (!caidanAwardInner.probability) {
                                caidanerror = true;
                                $('.plus').children('.wrong-tip').removeClass('hidden');
                            }
                        }
                        if (!caidanAwardInner.sduration || !caidanAwardInner.eduration || !caidanAwardInner.adcodes) {
                            caidanerror = true;
                            $('.plus').children('.wrong-tip').removeClass('hidden');
                        }

                        // 所有中奖条件已填才能push
                        caidanAward.push(JSON.stringify(caidanAwardInner));
                        return {
                            caidanerror: caidanerror,
                            caidanAward: caidanAward
                        }
                    }
                }

                if (_setPrizeScope.myVar) {
                    // 特殊
                    setPrize('special')
                }
                // 普通奖品必需填写
                setPrize('common')
                // 特殊 & 普通奖项设置fn
                function setPrize(tag) {
                    if (tag === 'special') {
                        // 特殊奖品
                        var prizeDomList = $('.first-draw-prize-wrap').find('.ready-set').children();
                    } else {
                        // 普通奖品
                        var prizeDomList = $('.non-first-draw-wrap').find('.ready-set').children();
                    }

                    var prizeDomList_len = prizeDomList.length;
                    var prizeDomList_arr = Array.apply(0, Array(prizeDomList_len)).map(function(item, index){
                        return index
                    })

                    if (tag === 'special') {
                        // 特殊奖品
                        processPrizeArr(prizeDomList_arr, prizeDomList, true)
                    } else {
                        // 普通奖品
                        processPrizeArr(prizeDomList_arr, prizeDomList, false)
                    }
                }
                // 具体-处理奖项数组
                function processPrizeArr(prizeDomList_arr, prizeDomList, specialBool) {
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

                        if (specialBool) {
                            ActivityPageAward.special = 1;
                        } else {
                            ActivityPageAward.special = 0;
                        }
                        ActivityPageAward.probability = item.find('.chance').val() || ''; //特殊奖品没有概率设置
                        ActivityPageAward.prizeName = item.find('.prizename').val() || '';
                        ActivityPageAward.multiChoose = 0; //目前暂定都为单选奖品

                        ActivityPageAward.details = []; //具体奖品数组，目前是单选
                        ActivityPageAward.details[0] = {};
                        ActivityPageAward.details[0].poolId = item[0].dataset.id || ''; // 默认，因为积分池的id是integralpool，不是这个字段
                        ActivityPageAward.details[0].awardName = item[0].dataset.name || '';
                        ActivityPageAward.details[0].awardPicUrl = item[0].dataset.giftPic || '';
                        ActivityPageAward.details[0].awardNums = radio_res_item.find('.number').val();
                        ActivityPageAward.details[0].score = radio_res_item.find('.score').val() || 0;

                        // 红包总金额，最小、最大
                        if (radio_res_item.hasClass('hb')) {
                            ActivityPageAward.details[0].awardType = 3;
                            ActivityPageAward.details[0].redTotalMoney = radio_res_item.find('.money').val();

                            if (radio_res_item.find('.circle-money-tick.active').parent().hasClass('random-hb')) {
                                ActivityPageAward.details[0].minred = radio_res_item.find('.min').val();
                                ActivityPageAward.details[0].bigred = radio_res_item.find('.max').val();
                            } else {
                                ActivityPageAward.details[0].minred = ActivityPageAward.details[0].bigred = radio_res_item.find('.fixed').val();
                            }    
                        } else {
                            if (radio_res_item.hasClass('gift')) {
                                // 礼品
                                ActivityPageAward.details[0].awardType = item[0].dataset.giftType;
                            } else {
                                // 积分
                                ActivityPageAward.details[0].awardType = 6;
                                ActivityPageAward.details[0].poolId = radio_res_item.data('integralPool');
                            }
                        }

                        if (radio_res_item.hasClass('gift') || radio_res_item.hasClass('hb')) {
                            var send_scores = radio_res_item.find('.tickcheckbox');
                            if (send_scores.prop('checked')) {
                                ActivityPageAward.details[0].giveScore = 1;
                                ActivityPageAward.details[0].integralPool = item[0].dataset.integralPool;
                            }
                        }

                        // 校验错误
                        if (!ActivityPageAward.prizeName || !ActivityPageAward.details[0].awardType || !ActivityPageAward.details[0].awardNums) {
                            ActivityPageAward.special ? specialerror = true : commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }

                        if (send_scores.prop('checked') && !ActivityPageAward.details[0].integralPool) {
                            ActivityPageAward.special ? specialerror = true : commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }

                        if (radio_res_item.find('.hbnumber').length != 0 && !ActivityPageAward.details[0].redTotalMoney) {
                            ActivityPageAward.special ? specialerror = true : commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }

                        if (ActivityPageAward.special == 0 && !ActivityPageAward.probability) {
                            commonerror = true;
                            item.children('.wrong-tip').removeClass('hidden');
                        }
                        activityAwards.push(ActivityPageAward);  
                    })
                }

                // 最后整合成提交对象
                var fromSonScope = {
                    copyOfPageCode: angular.element('.all-template-config-wrap').scope().pageCode,
                    pageCode: _basicScope.pageCode || '',
                    activityForm: _basicScope.activityForm,
                    activityCode: angular.element('.all-template-config-wrap').scope().activityCode || '',
                    pageName: _basicScope.pageName || '',
                    activityDec: _basicScope.descValue || '', //活动描述
                    activityDoc: _basicScope.introValue || '', //活动说明
                    activityEntrance: _basicScope.accessUrl || '', //accessUrl
                    activityEntranceAttach: _basicScope.attachCode || '', // attachCode
                    idx: _basicScope.namePriority || 1,
                    name: _basicScope.nameVaule || '',
                    attachUrl: '',
                    score: _participateScope.nameIntegral || 0,
                    limitPer: _participateScope.namePerPersonDay || 0,
                    limitAll: _participateScope.namePerPerson || 0,
                    supplier: _launchScope.selectCompanyVal || '',
                    brandCode: _launchScope.selectBrandVal || [],
                    sn: _launchScope.selectSpecificationVal || [],
                    areaCodes: _launchScope.selectAreaVal || [],
                    holiday: _launchScope.whichday || 3,
                    stime: _launchScope.startTime || '',
                    etime: _launchScope.endTime || '',
                    specialCode: 'FIRST_LOTTERY_BE_WON',
                    // specialAwardStr: specialAward.toString() || '',
                    // commonAwardStr: commonAward.toString() || '',
                    activityAwards: activityAwards,
                    caidanConfigStr: _drawPrizeScope ? caidanAward.toString() : '',
                    status: that_scope.activityCode ? that_scope.conf.data.activity.status : $('.online').prop('checked') ? 1 : 2
                }

                console.log(fromSonScope);

                checkEmpty(fromSonScope)
                // final校验 & 提交
                function checkEmpty(fromSonScope,finalerror) {
                    for (var s in fromSonScope) {
                        // attachUrl, specialAwardStr 这两个可以为空
                        if (s == 'name' && fromSonScope[s] == '' ) {
                           // 活动名称没选
                           finalerror = true;
                           $('.activity-name .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityEntrance' && fromSonScope[s] == '') {
                            // 活动图片未上传
                            finalerror = true;
                            $('.configuration-image .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityDec' && fromSonScope[s] == '') {
                            // 活动描述没写
                            finalerror = true;
                            $('.activity-desc .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'activityDoc' && fromSonScope[s] == '') {
                            // 活动说明没写
                            finalerror = true;
                            $('.activity-intro .wrong-tip').removeClass('hidden');
                        }

                        if (!_drawPrizeScope) {
                            if (s == 'idx' && fromSonScope[s] == '') {
                                // 优先级没写
                                finalerror = true;
                                $('.activity-priority .wrong-tip').removeClass('hidden');
                            }
                        }
                        
                        if (s == 'areaCodes' && fromSonScope[s].length == 0) {
                            // 地区没选
                            finalerror = true;
                            $('.select-area .wrong-tip').removeClass('hidden');
                        }
                        if (s == 'brands' && fromSonScope[s].length == 0) {
                            // 品牌没选
                            finalerror = true;
                            $('.select-brand .wrong-tip').removeClass('hidden');
                        }
                        if (s == 'sns' && fromSonScope[s].length == 0) {
                            // 规格没选
                            finalerror = true;
                            $('.select-specification .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'stime' && fromSonScope[s] == '') {
                            // 开始时间没选
                            finalerror = true;
                            $('.select-duration .wrong-tip').removeClass('hidden');
                        }

                        if (s == 'etime' && fromSonScope[s] == '') {
                            // 结束时间没选
                            finalerror = true;
                            $('.select-duration .wrong-tip').removeClass('hidden');
                        }
                    }

                    if (_setPrizeScope.myVar) {
                        if (!specialerror && !commonerror && !finalerror) {
                            scope.$emit('fromcommonactivity', event, fromSonScope);
                        } else {
                            alert('奖品设置有误，请核对后再提交')
                        }
                    } else {
                        if (_drawPrizeScope) {
                            if (!caidanerror && !commonerror && !finalerror) {
                                scope.$emit('fromcommonactivity', event, fromSonScope);
                            } else {
                                alert('奖品设置有误，请核对后再提交')
                            }
                        } else {
                            if (!commonerror && !finalerror) {
                                scope.$emit('fromcommonactivity', event, fromSonScope);
                            } else {
                                alert('奖品设置有误，请核对后再提交')
                            }
                        }
                    }
                }
            } 
        }

        return defineObj;
    }

    finalcreate.directive('saFinalcreate', ['$rootScope', '$http', '$compile', '$timeout', 'util', finalcreateFn]);
})
