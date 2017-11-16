/**
 * Author: hanzha
 * Create Date: 2017-11-10
 * Description: 广告位管理
 */

define([], function () {
  var adsenseModel = {
    ServiceType: 'service',
    ServiceName: 'adsenseModel', // 这里如果是给controller引用的话，那下面的return是什么..
    ServiceContent: ['request', function (request) {

      //定义资源
      var $model = this;

      // 厂家
      var GET_ADS_MANUFACTURER_LIST = '/api/tztx/saas/admin/sys/queryListAllOrg';
      $model.getAdsManufacturer = function () {
        return request.$Search(GET_ADS_MANUFACTURER_LIST)
      }

      // 使用状态
      var GET_ADS_STATUS_LIST = '/api/tztx/saas/saotx/common/queryDim';
      $model.getAdsStatusList = function () {
        return request.$Search(GET_ADS_STATUS_LIST, {cateCode: "data_status"})
      }

      // 品牌
      var GET_ADS_BRANDS_LIST = '/api/tztx/saas/saotx/brand/queryBrands';
      $model.getAdsBrandsList = function () {
        return request.$Search(GET_ADS_BRANDS_LIST)
      }

      // 广告位列表
      var GET_ADSENSE_LIST = '/api/tztx/saas/saotx/ad/querySpaceList';
      $model.getAdsenseList = function (data) {
        return request.$Search(GET_ADSENSE_LIST, data)
      }

      // 广告列表
      var GET_ADS_LIST = '/api/tztx/saas/saotx/ad/queryListAllNoPage';
      $model.getAdsList = function (data) {
        return request.$Search(GET_ADS_LIST, data)
      }

      // 编辑时获取某一条的数据
      var GET_ADS_INFO = '/api/tztx/saas/saotx/ad/queryAdSpaceById';//?id=xxx
      $model.getAdsInfo = function (data) {
        return request.$Search(GET_ADS_INFO, data)
      }

      // 编辑保存，这里传data是干嘛的？？？data是传的参数
      var EDIT_ADS = '/api/tztx/saas/saotx/ad/saveOrUpdateSpace';
      $model.editAds = function (data) {
        return request.$Search(EDIT_ADS, data);
      }

      // 启用、停用
      var START_DISABLE_ADS = '/api/tztx/saas/saotx/ad/AdvertSpaceStatus';
      $model.startDisableAds = function (data) {
        return request.$Search(START_DISABLE_ADS, data)
      }

    }]
  }
  return adsenseModel
})
