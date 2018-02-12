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
            scope.activity = that_scope.conf.data.activity;
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
              var firstornot = $(e.target).parents('.first-draw').length > 0 ? true : false;
              var giftType = $(e.target).parents('.prize-img-preview-wrap').data('gifttype');
              var poolId = $(e.target).parents('.prize-img-preview-wrap').data('id');
              var specialCode = $(e.target).parents('.prize-img-preview-wrap').data('type'); //奖池类型
              // 把红包id传到controller
              var data = {
                activityCode: that_scope.activityCode,
                dataId: id,
                ori: hasClassornot,
                index: drawPrizeWrap_index,
                item_index: item_index,
                firstornot: firstornot,
                giftType: giftType,
                poolId: poolId,
                specialCode : specialCode
              };
              scope.$emit('giftaddstockid', event, data)
          })

          // 红包增库
          $('#setprize').on('click', '.add-hb-stock,.add-hb-stock-num', function(e){
              // 把礼品id传到controller
              var id = $(e.target).parents('.draw-prize-wrap').data('id');
              var drawPrizeWrap_index = $(e.target).parents('.draw-prize-wrap').index();
              var poolId = $(e.target).parents('.radio-res').data('poolid');
              var specialCode = $(e.target).parents('.radio-res').data('type'); //奖池类型
              var dataId = $(e.target).parents('.radio-res').data('dataid');
              // 把红包id传到controller
              var data = {
                  id: id, 
                  index: drawPrizeWrap_index,
                  poolId: poolId,
                  specialCode: specialCode,
                  dataId: dataId
              };
              scope.$emit('hbaddstockid', event, data)
          })

          //积分数量增库notminusnotzero
          $('#setprize').on('click', '.add-points-stock', function(e){
            // 把礼品id传到controller
            var poolId = $(e.target).parents('.radio-res').data('poolid');
            var specialCode = $(e.target).parents('.radio-res').data('type'); //奖池类型
            var dataId = $(e.target).parents('.radio-res').data('dataid');
            // 把红包id传到controller
            var data = {
                poolId: poolId,
                specialCode: specialCode,
                dataId: dataId
            };
            scope.$emit('pointAddStock', event, data)
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
            // 默认初始化自己的文本框加上点击事件。
          $(document).ready(function () {
              $(".my-select").multiselect({
                  nonSelectedText: '请选择',
                  nSelectedText: '已选择',
                  includeSelectAllOption: true,
                  selectAllText: '全部',
                  allSelectedText: '全选',
                  enableFiltering: true,
                  numberDisplayed: 1,
                  onDropdownShow: function () { // 就是点击下拉框调用
                      var eleArray = $('.non-first-draw.gotoset .non-first-draw-wrap .create-part.ng-scope .draw-prize-wrap');
                      // 拿奖项名称的数据
                      var resultArray = [];
                      for (var i = 0; i < eleArray.length; i++) {
                          if ($(eleArray[i]).find('.configuration-item').find('.prizename').val().trim() != '') {
                              resultArray.push({
                                  name: $(eleArray[i]).find('.configuration-item').find('.prizename').val(),
                                  value: $(eleArray[i]).find('.configuration-item').find('.prizename').val(),
                              });
                          }
                      };
                      if (resultArray.length >= 3) {
                          $('.special-rules-item .multiselect-container.dropdown-menu').css('height', '130px');
                      } else {
                          $('.special-rules-item .multiselect-container.dropdown-menu').css('height', '');
                      };
                      $(this.$select).multiselect('dataprovider', _.forEach(resultArray, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                          v.label = v.name;
                          v.value = v.value;
                      }));
                      $(this.$select).multiselect('refresh');
                  }
              });
          });

          // 添加字体图标
          $('body').on('click', '.specialIncrease', function () {
              var html = '<div class="special-rules-item operation multi">' +
                  '<span>用户第&nbsp;</span>' +
                  '<input type="text" class="input">' +
                  '<span>&nbsp;次抽奖必中&nbsp;</span>' +
                  '<div class="special-select">' +
                  '<select name="data" class="select my-select">' +
                  '</select>' +
                  '</div>' +
                  '<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>' +
                  '<span class="glyphicon glyphicon-minus-sign special-icon specialReduce" ></span>' +
                  '<div class="special-wrong hidden">' +
                  '<div class="wrong-tip special-tip">请完善该奖项信息，确保红星标识处已填写！</div>' +
                  '</div>' +
                  '</div>';
              $(this).parent().after(html);
              if (!$(this).siblings('.specialReduce').length) {
                  $(this).before('<span class="glyphicon glyphicon-minus-sign special-icon specialReduce" ></span>')
              };
              $(this).remove();
              $(document).ready(function () {
                  $(".multi .select").multiselect({
                      nonSelectedText: '请选择',
                      nSelectedText: '已选择',
                      includeSelectAllOption: true,
                      selectAllText: '全部',
                      allSelectedText: '全选',
                      enableFiltering: true,
                      numberDisplayed: 1,
                      selectedList: '',
                      onDropdownShow: function (e) { // 就是点击下拉框调用
                          var eleArray = $('.non-first-draw.gotoset .non-first-draw-wrap .create-part.ng-scope .draw-prize-wrap');
                          // 拿奖项名称的数据
                          var resultArray = [];
                          for (var i = 0; i < eleArray.length; i++) {
                              if ($(eleArray[i]).find('.configuration-item').find('.prizename').val().trim() != '') {
                                  resultArray.push({
                                      name: $(eleArray[i]).find('.configuration-item').find('.prizename').val(),
                                      value: $(eleArray[i]).find('.configuration-item').find('.prizename').val(),
                                  });
                              }
                          };
                          if (resultArray.length >= 3) {
                              $('.special-rules-item .multiselect-container.dropdown-menu').css('height', '130px');
                          } else {
                              $('.special-rules-item .multiselect-container.dropdown-menu').css('height', '');
                          };
                          $(this.$select).multiselect('dataprovider', _.forEach(resultArray, function (v) { // 这里有个小坑：循环的必须是数组包含对象他自己会在你的对象里塞个字段label
                              v.label = v.name;
                              v.value = v.value;
                          }));
                          $(this.$select).multiselect('refresh');
                      }
                  });
              });
          });

          // 减去字体图标
          $('body').on('click', '.specialReduce', function () {
            $(this).parent('.special-rules-item').remove();
              if ($('.special-rules-item').length == '1') {
                  if (!$('.special-rules-item').find('.specialIncrease').length) {
                      $('.special-rules-item').find('.specialReduce').before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>')
                      console.log('加加');
                  };
                  if ($('.special-rules-item').find('.specialReduce').length) {
                      console.log('姗姗');
                      $('.special-rules-item').find('.specialReduce').remove();
                  }
                //   $(e.target).remove();
                //   if(!$(e.target).siblings('.specialIncrease').length){
                //       $(e.target).before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>')
                //   }
              }else{
                if(!$('.special-rules-item:last-child').find('.specialIncrease').length){
                    $('.special-rules-item:last-child').find('.specialReduce').before('<span class="glyphicon glyphicon-plus-sign special-icon specialIncrease" ></span>');
                }
              }
          });
      }
      return defineObj;
  }

  setprize.directive('saSetprize', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'numberFormat', 'hbpriceFormat', 'decimalFormat', setprizeFn]);
})
