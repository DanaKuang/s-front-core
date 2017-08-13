/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: virtualPrizeGotHistory
 */

define([], function () {
  var vPrizeGotHistoryModel = {
    ServiceType: 'service',
    ServiceName: 'vPrizeGotHistoryModel',
    ServiceContent: ['request', function (request) {
      var $model = this;

      // 领奖明细
      var GET_PRIZE_LIST = '/api/tztx/saas/saotx/order/queryOrderList';
      // 所有品牌
      var GET_ALL_BRANDS = '/api/tztx/saas/saotx/brand/queryBrands';
      // 根据品牌选择规格
      var GET_PRODUCT_LIST = '/api/tztx/saas/saotx/common/queryProduct';
      // 地区
      var GET_TIER_AREA = '/api/tztx/saas/saotx/common/queryRegionByParentCode';

      // 根据订单号查询
      var GET_ORDER_DETAIL = '/api/tztx/saas/saotx/order/detailByCode';

      // 活动状态
      var GET_ACTIVITY_STATUS = '/api/tztx/saas/saotx/activity/queryDimDataStatus';

      // 领奖明细
      $model.getprizelist = function (data) {
          return request.$Search(GET_PRIZE_LIST, data);
      }

      // 所有品牌
      $model.getAllBrands = function () {
          return request.$Search(GET_ALL_BRANDS);
      }

      // 根据品牌，获取规格
      $model.getProductList = function (data) {
          return request.$Search(GET_PRODUCT_LIST, data)
      }

      // 获取地区
      $model.getTierArea = function (data) {
          return request.$Search(GET_TIER_AREA, data);
      }

      // 根据订单号查询
      $model.getorderdetail = function (data) {
        return request.$Search(GET_ORDER_DETAIL, data)
      }

      // 查询活动该状态
      $model.getActivityStatus = function () {
          return request.$Search(GET_ACTIVITY_STATUS)
      }

    }]
  };
  return vPrizeGotHistoryModel;
});