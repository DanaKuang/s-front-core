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
          util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'myVar']);
          // 监视conf变化更新 basicinfo
          scope.$watch('conf', function () {
              // 属性赋值
              util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['chooseNum', 'firstornot', 'myVar']);
          }, true);

          var that_scope = angular.element('.all-template-config-wrap').scope();
          if (that_scope.activityCode) {
            // 编辑
            var dcList = that_scope.conf.data.dcList;
            scope.dcList = that_scope.conf.data.dcList;
            scope.disabled = true;
            if (scope.dcList.FIRST_LOTTERY_BE_WON.length > 0) {
              scope.myVar = true;
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

          // 勾选积分池
          $('#setprize').on('click', '.tickcheckbox', function (e) {
              if ($(e.target).prop('checked')) {
                  $(e.target).siblings('.sendscore').removeClass('hidden')
              } else {
                  $(e.target).siblings('.sendscore').addClass('hidden')
              }
          })
      }
      return defineObj;
  }

  setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', setprizeFn]);
})
