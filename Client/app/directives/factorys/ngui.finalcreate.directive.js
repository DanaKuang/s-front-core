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

            scope.updateActivity = function () {
                var _basicScope = angular.element('.basicinfo').scope();
                var _participateScope = angular.element('.participate-integral').scope();
                var _launchScope = angular.element('.select-brand').scope();
                var _setPrizeScope = angular.element('.ready-set').scope();
                var _drawPrizeScope = angular.element('.draw-prize').scope();

                // 奖项设置里面最终要传的两个数组
                var specialAward = [];
                var commonAward = [];
                var specialerror = false, commonerror = false, finalerror = false;

                bigVerify()
                function bigVerify() {
                    // 若勾选特殊奖品
                    if (_setPrizeScope.myVar) {
                        // 勾选了首抽必中
                        var first_arr = $('.first-draw-prize-wrap').find('.ready-set').children();
                        var first_arr_len = first_arr.length;

                        var special_trans_arr = Array.apply(0, Array(first_arr_len)).map(function(item, index){
                            return index
                        });

                        processSpecial(special_trans_arr);
                        function processSpecial(trans_arr) {
                            trans_arr.forEach(function(n, index) {
                                var specialAwardInner = {};
                                specialAwardInner.specialAwards = '';
                                specialAwardInner.specialAwardTypes = '';
                                specialAwardInner.specialAwardName = '';
                                specialAwardInner.prizeName = '';
                                specialAwardInner.specialAwardPics = '';
                                specialAwardInner.specialAwardNums = '';
                                specialAwardInner.specialRedTotalMoney = '';
                                specialAwardInner.specialRedNum = '';
                                specialAwardInner.specialMinred = '';
                                specialAwardInner.specialBigred = '';
                                specialAwardInner.specialAwardScores = '';

                                var n = first_arr.eq(n);

                                specialAwardInner.specialAwards = n[0].dataset.id;
                                specialAwardInner.prizeName = n.find('.prizename').val() || '';
                                specialAwardInner.specialAwardPics = n[0].dataset.giftPic || '';
                                specialAwardInner.specialAwardName = n[0].dataset.name || '';

                                if (n.parents('.sethbprize').length != 0) {
                                    // 微信红包专属活动
                                    var radio_res_item = n.find('.hb-res');
                                } else {
                                    // 通用3选1
                                    var num = n.find('.radio-wrap').find('.active').parent().index();
                                    var radio_res_item = n.find('.radio-res-wrap').children().eq(num);
                                }

                                // 红包总金额，最小、最大
                                if (radio_res_item.hasClass('hb')) {
                                    specialAwardInner.specialAwardTypes = 3;
                                    specialAwardInner.specialRedTotalMoney = radio_res_item.find('.money').val();

                                    specialAwardInner.specialRedNum = radio_res_item.find('.hbnumber').val();

                                    if (radio_res_item.find('.circle-money-tick.active').parent().hasClass('random-hb')) {
                                        specialAwardInner.specialMinred = radio_res_item.find('.min').val();
                                        specialAwardInner.specialBigred = radio_res_item.find('.max').val();
                                    } else {
                                        specialAwardInner.specialMinred = radio_res_item.find('.fixed').val();
                                        specialAwardInner.specialBigred = radio_res_item.find('.fixed').val();
                                    }    
                                } else {
                                    specialAwardInner.specialAwardNums = radio_res_item.find('.number').val();
                                    if (radio_res_item.hasClass('gift')) {
                                        // 礼品
                                        specialAwardInner.specialAwardTypes = n[0].dataset.giftType;
                                    } else {
                                        // 积分
                                        specialAwardInner.specialAwardTypes = 6;
                                        specialAwardInner.specialAwardScores = radio_res_item.find('.score').val();
                                    }
                                }

                                if (radio_res_item.hasClass('gift') || radio_res_item.hasClass('hb')) {
                                    var send_scores = radio_res_item.find('.tickcheckbox');
                                    if (send_scores.prop('checked')) {
                                        specialAwardInner.specialAwardScores = radio_res_item.find('.score').val() || 0;
                                    } else {
                                        specialAwardInner.specialAwardScores = 0;
                                    }
                                }

                                // 校验错误
                                if (!specialAwardInner.prizeName || !specialAwardInner.specialAwardTypes) {
                                    if (!specialAwardInner.prizeName) {
                                    }
                                    specialerror = true;
                                    n.children('.wrong-tip').removeClass('hidden');
                                }

                                // 校验模板有没有选择，目前除了积分之外都要选择
                                if (specialAwardInner.specialAwardTypes != 6) {
                                    if (!specialAwardInner.specialAwards) {
                                        specialerror = true;
                                        n.children('.wrong-tip').removeClass('hidden');
                                    }
                                }

                                if (radio_res_item.find('.hbnumber').length != 0) {
                                    if (!specialAwardInner.specialRedNum) {
                                        specialerror = true;
                                        n.children('.wrong-tip').removeClass('hidden');
                                    } 
                                    if (!specialAwardInner.specialRedTotalMoney) {
                                        specialerror = true;
                                        n.children('.wrong-tip').removeClass('hidden');
                                    }
                                } else {
                                    if (!specialAwardInner.specialAwardNums) {
                                        specialerror = true;
                                        n.children('.wrong-tip').removeClass('hidden');
                                    }
                                }

                                // 无错则push
                                specialAward.push(JSON.stringify(specialAwardInner))
                            })
                        }
                    }

                    // 普通奖品必需填写
                    var non_first_arr = $('.non-first-draw-wrap').find('.ready-set').children();
                    var non_first_arr_len = non_first_arr.length;

                    var common_trans_arr = Array.apply(0, Array(non_first_arr_len)).map(function(item, index){
                        return index
                    })

                    processCommon(common_trans_arr);
                    function processCommon(trans_arr) {
                        trans_arr.forEach(function (n, index) {
                            var commonAwardInner = {};
                            commonAwardInner.chance = '';
                            commonAwardInner.commonAwards = '';
                            commonAwardInner.commonAwardTypes = '';
                            commonAwardInner.commonAwardName = '';
                            commonAwardInner.prizeName = '';
                            commonAwardInner.commonAwardPics = '';
                            commonAwardInner.commonAwardNums = '';
                            commonAwardInner.commonRedTotalMoney = '';
                            commonAwardInner.commonRedNum = '';
                            commonAwardInner.commonMinred = '';
                            commonAwardInner.commonBigred = '';
                            commonAwardInner.commonAwardScores = '';

                            var n = non_first_arr.eq(n);

                            commonAwardInner.commonAwards = n[0].dataset.id || '';
                            commonAwardInner.commonAwardPics = n[0].dataset.giftPic || '';
                            commonAwardInner.commonAwardName = n[0].dataset.name || '';
                            commonAwardInner.prizeName = n.find('.prizename').val();
                            commonAwardInner.chance = n.find('.chance').val();

                            if (n.parents('.sethbprize').length != 0) {
                                // 微信红包专属活动
                                var radio_res_item = n.find('.hb-res');
                            } else {
                                // 通用3选1
                                var num = n.find('.radio-wrap').find('.active').parent().index();
                                var radio_res_item = n.find('.radio-res-wrap').children().eq(num);
                            }

                            // 红包总金额，最小、最大
                            if (radio_res_item.hasClass('hb')) {
                                commonAwardInner.commonRedTotalMoney = radio_res_item.find('.money').val();
                                commonAwardInner.commonAwardTypes = 3;
                                commonAwardInner.commonRedNum = radio_res_item.find('.hbnumber').val();

                                if (radio_res_item.find('.circle-money-tick.active').parent().hasClass('random-hb')) {
                                    commonAwardInner.commonMinred = radio_res_item.find('.min').val();
                                    commonAwardInner.commonBigred = radio_res_item.find('.max').val();
                                } else {
                                    commonAwardInner.commonMinred = radio_res_item.find('.fixed').val();
                                    commonAwardInner.commonBigred = radio_res_item.find('.fixed').val();
                                }
                            } else {
                                // 奖品数量
                                commonAwardInner.commonAwardNums = radio_res_item.find('.number').val();
                                if (radio_res_item.hasClass('gift')) {
                                    commonAwardInner.commonAwardTypes = n[0].dataset.giftType;
                                } else {
                                    // 积分
                                    commonAwardInner.commonAwardTypes = 6;
                                    commonAwardInner.commonAwardScores = radio_res_item.find('.score').val();
                                }
                            }

                            if (radio_res_item.hasClass('gift') || radio_res_item.hasClass('hb')) {
                                // 赠送积分
                                var send_scores = radio_res_item.find('.tickcheckbox');
                                if (send_scores.prop('checked')) {
                                    commonAwardInner.commonAwardScores = radio_res_item.find('.score').val();
                                } else {
                                    commonAwardInner.commonAwardScores = 0;
                                }
                            } 

                            // 校验错误
                            if (!_drawPrizeScope) {
                                if (!commonAwardInner.prizeName || !commonAwardInner.chance || !commonAwardInner.commonAwardTypes) {
                                    commonerror = true;
                                    n.children('.wrong-tip').removeClass('hidden');
                                }
                            } else {
                                if (!commonAwardInner.prizeName || !commonAwardInner.commonAwardTypes) {
                                    commonerror = true;
                                    n.children('.wrong-tip').removeClass('hidden');
                                }
                            }

                            // 校验模板有没有选择，目前除了积分之外都要选择
                            if (commonAwardInner.commonAwardTypes != 6) {
                                if (!commonAwardInner.commonAwards) {
                                    commonerror = true;
                                    n.children('.wrong-tip').removeClass('hidden');
                                }
                            }

                            if (radio_res_item.find('.hbnumber').length != 0) {
                                if (!commonAwardInner.commonRedNum) {
                                     commonerror = true;
                                     n.children('.wrong-tip').removeClass('hidden');
                                } 
                                if (!commonAwardInner.commonRedTotalMoney) {
                                     commonerror = true;
                                     n.children('.wrong-tip').removeClass('hidden');
                                }
                                // 每份金额未填
                                if (!commonAwardInner.commonMinred || !commonAwardInner.commonBigred) {
                                    commonerror = true;
                                    n.children('.wrong-tip').removeClass('hidden');
                                }
                            } else {
                                if (!commonAwardInner.commonAwardNums) {
                                     commonerror = true;
                                     n.children('.wrong-tip').removeClass('hidden');
                                }
                            }

                            // 校验通过则push
                            commonAward.push(JSON.stringify(commonAwardInner))
                        }) 
                    }

                    // 彩蛋奖品
                    if (_drawPrizeScope) {
                        var caidanerror = false;
                        var caidanAward = [];
                        processCaidanDraw();
                        function processCaidanDraw() {
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
                        }
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
                        idx: _basicScope.namePriority || 0,
                        name: _basicScope.nameVaule || '',
                        attachUrl: '',
                        score: _participateScope.nameIntegral || 0,
                        limitPer: _participateScope.namePerPersonDay || 0,
                        limitAll: _participateScope.namePerPerson || 0,
                        supplier: _launchScope.selectCompanyVal || '',
                        brands: _launchScope.selectBrandVal || [],
                        sns: _launchScope.selectSpecificationVal || [],
                        areaCodes: _launchScope.selectAreaVal || [],
                        holiday: _launchScope.whichday || 3,
                        stime: _launchScope.startTime || '',
                        etime: _launchScope.endTime || '',
                        specialCode: 'FIRST_LOTTERY_BE_WON',
                        specialAwardStr: specialAward.toString() || '',
                        commonAwardStr: commonAward.toString() || '',
                        caidanConfigStr: _drawPrizeScope ? caidanAward.toString() : '',
                        status: that_scope.activityCode ? that_scope.conf.data.activity.status : $('.online').prop('checked') ? 1 : 2
                    }

                    checkEmpty();
                    function checkEmpty() {
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

        }

        return defineObj;
    }

    finalcreate.directive('saFinalcreate', ['$rootScope', '$http', '$compile', '$timeout', 'util', finalcreateFn]);
})
