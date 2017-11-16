/**
 * Author: hanzha
 * Create Date: 2017-09-14
 * Description: sourceActs
 */

define([], function () {
  var adssourceModel = {
    ServiceType: 'service',
    ServiceName: 'adssourceModel', // 这里如果是给controller引用的话，那下面的return是什么..
    ServiceContent: ['request', function (request) {

      //定义资源
      var $model = this;

      // 使用状态
      var GET_ADS_STATUS_LIST = '/api/tztx/saas/saotx/common/queryDim';
      $model.getAdsStatusList = function () {
        return request.$Search(GET_ADS_STATUS_LIST, {cateCode: "data_status"})
      }

      // 广告列表
      var GET_ADS_LIST = '/api/tztx/saas/saotx/ad/queryList';
      $model.getAdsSourceList = function (data) {
        return request.$Search(GET_ADS_LIST, data)
      }

      // 编辑时获取某一条的数据
      var GET_ADS_INFO = '/api/tztx/saas/saotx/ad/queryAdById';//?id=xxx
      $model.getAdsInfo = function (data) {
        return request.$Search(GET_ADS_INFO, data)
      }

      // 编辑保存，这里传data是干嘛的？？？data是传的参数
      var EDIT_ADS = '/api/tztx/saas/saotx/ad/saveOrUpdate';
      $model.editAds = function (data) {
        return request.$Search(EDIT_ADS, data);
      }

      // 启用、停用
      var START_DISABLE_ADS = '/api/tztx/saas/saotx/ad/modifyStatus';
      $model.startDisableAds = function (data) {
        return request.$Search(START_DISABLE_ADS, data)
      }

      // 礼品
      var GIFT_ADS = '/api/tztx/saas/saotx/product/queryMetraList';
      $model.giftAds = function () {
        return request.$Search(GIFT_ADS, {metraType: 'gift'})
      }

    }]
  }
  return adssourceModel
})
