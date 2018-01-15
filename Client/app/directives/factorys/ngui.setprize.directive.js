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
          firstornot: false,
          thanksornot: false,
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
          util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'thanksornot', 'myVar', 'myThanks']);
          // 监视conf变化更新 basicinfo
          scope.$watch('conf', function () {
              // 属性赋值
              util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'thanksornot', 'myVar', 'myThanks']);
          }, true);

          var that_scope = angular.element('.all-template-config-wrap').scope();
          if (that_scope.activityCode) {
            // 编辑
            var dcList = that_scope.conf.data.dcList;
            scope.dcList = that_scope.conf.data.dcList;
            scope.disabled = true;
            if (scope.dcList.FIRST_LOTTERY_BE_WON && scope.dcList.FIRST_LOTTERY_BE_WON.length > 0) {
              scope.myVar = true;
            }
            if (scope.dcList.INVOLVE && scope.dcList.INVOLVE.length > 0) {
              scope.myThanks = true;
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
                      hasLeft: true,//是否查询有库存的池数据。true-池剩余必须大于0；false或空参则忽略库存数量
                      scope: angular.element(e.target).scope()
                  }
                  scope.$emit('fromActivityConfigtoChooseProduct', event, data);

                  scope.chooseNum = $(e.target).parents('.draw-prize-wrap').index();
                  scope.firstornot = $(e.target).parents('.gotoset').hasClass('first-draw');
                  scope.thanksornot = $(e.target).parents('.gotoset').hasClass('thanks-draw-wrap');
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

                  $('.show-hb-list').parent().removeClass('choose-tag');
                  $(this).parent().addClass('choose-tag');
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
                  scope.thanksornot = $(e.target).parents('.gotoset').hasClass('thanks-draw-wrap');

                  $('.show-jf-list').parent().removeClass('choose-tag');
                  $(this).parent().addClass('choose-tag');
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
              var special_dom = $compile($('#special-prize').html())(scope.$new());
              $(e.target).prev('.ready-set').find('.create-part').append(special_dom)
            } else {
              var non_special_dom = $compile($('#non-special-prize').html())(scope.$new());
              $(e.target).prev('.ready-set').find('.create-part').append(non_special_dom)
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
                parentsDrawPrizeWrap.dataset.integralPool = '';
                $(parentsDrawPrizeWrap).find('.radio-res-wrap input').val('');
                $(parentsDrawPrizeWrap).find('input[type="checkbox"]').prop('checked', false);
                $(parentsDrawPrizeWrap).find('.sendscore').addClass('hidden');
                $(parentsDrawPrizeWrap).find('.show-chosen').html('');

                $target.addClass('active').parent().siblings().children('.circle-tick').removeClass('active');
                var num = $target.parents('.radio-group').index();
                $target.parents('.radio-wrap').next().children().eq(num).removeClass('hidden').siblings().addClass('hidden');

                var giftpack = $(parentsDrawPrizeWrap).find('.giftpack');
                if (angular.element($(giftpack)).scope().giftpackConf) {
                  angular.element($(giftpack)).scope().giftpackConf.list = [];
                }
              }
              if ($target.hasClass('circle-money-tick')) {
                  $target.addClass('active').parents('.hb-money-wrap').siblings().children('.circle-money-tick').removeClass('active').siblings().val('').prop('readonly', true);
                  $target.siblings().prop('readonly', false)
              }
          }

          // 礼品增库
          $('#setprize').on('click', '.add-gift-stock', function(e){
              var id = $(e.target).parents('.prize-img-preview-wrap').data('dataid');
              var drawPrizeWrap_index = $(e.target).parents('.edit-part').index();
              var item_index = $(e.target).parents('.prize-img-preview-wrap-repeat').index();
              var hasClassornot = $(e.target).parents('.hasdetails').length > 0 ? 'dcMoreExt' : 'dcExt';
              var firstornot = $(e.target).parents('.first-draw').length > 0 ? true : false
              // 把红包id传到controller
              var data = {
                activityCode: that_scope.activityCode,
                dataId: id,
                ori: hasClassornot,
                index: drawPrizeWrap_index,
                item_index: item_index,
                firstornot: firstornot
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

          // 勾选积分池
          $('#setprize').on('click', '.tickcheckbox', function (e) {
              if ($(e.target).prop('checked')) {
                  $(e.target).siblings('.sendscore').removeClass('hidden')
              } else {
                  $(e.target).siblings('.sendscore').addClass('hidden')
              }
          })

         /* 特殊规则设置 */
           // 添加字体图标
            $('.special-rules-info').on('click','.specialIncrease',function (e) {
                var html = '<div class="special-rules-item operation multi">'+
                                '<span>用户第&nbsp;</span>'+
                                '<input type="text" class="input">'+
                                '<span>&nbsp;次抽奖必中&nbsp;</span>'+
                                '<div class="special-select">'+
                                    '<select name="data" class="select">'+
                                        '<option>空</option>'+
                                        '<option value="1111" label="2222"></option>'+
                                        '<option value="1111" label="2222"></option>'+
                                        '<option value="1111" label="2222"></option>'+
                                        '<option value="1111" label="2222"></option>'+
                                    '</select>'+
                                '</div>'+
                                '<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>'+
                                '<span class="glyphicon glyphicon-minus-sign special-icon specialReduce" ></span>'+
                                '<div class="special-wrong hidden">'+
                                    '<div class="wrong-tip special-tip">请完善该奖项信息，确保红星标识处已填写！</div>'+
                                '</div>'+
                            '</div>'
                $('.special-rules-info').append(html);             
                    if(!$(e.target).siblings('.specialReduce').length){
                        scope.specialIconReduce = false;
                        $(e.target).before('<span class="glyphicon glyphicon-minus-sign special-icon specialReduce" ></span>')
                    }
                    e.target.remove();
                $(document).ready(function () {
                    $(".multi .select").multiselect({
                    nonSelectedText: '请选择',
                    nSelectedText: '已选择',
                    includeSelectAllOption: true,
                    selectAllText: '全部',
                    allSelectedText: '全选',
                    enableFiltering: true,
                    maxHeight: '500px',
                    numberDisplayed: 1
                    });
                });
                scope.specialIconReduce = true; // 就是为了一开始不让看见减号。之后就总见了。
                scope.$apply();
            });
            // 减去字体图标
            $('.special-rules-info').on('click','.specialReduce',function (e) {
                $(e.target).parent('.special-rules-item').remove();              
                if($('.special-rules-item').length==1){
                    console.log($('.special-rules-item').length);
                    if(!$('.special-rules-item').find('.specialIncrease').length){
                        console.log('添加');
                        $('.special-rules-item').find('.specialReduce').before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>')
                    }
                    if($('.special-rules-item').find('.specialReduce').length){
                        console.log('删除');
                        $('.special-rules-item').find('.specialReduce').remove();
                    }
                    // $(e.target).remove();
                    // if(!$(e.target).siblings('.specialIncrease').length){
                    //     $(e.target).before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>')
                    // }
                };
                if($(e.target).siblings('.specialIncrease').length){
                    $('.special-rules-item:last-child').find('.specialReduce').before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>');
                }
            })
            var doc=  $('.ready-set .create-part').children()
            console.log(doc);
      }
      return defineObj;
  }

  setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', setprizeFn]);
})
