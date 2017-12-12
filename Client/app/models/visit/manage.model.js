/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */
define([], function () {
    var visitManageModel = {
        ServiceType: "service",
        ServiceName: "visitManageModel",
        ServiceContent: ['request', function (request) {

          //定义资源
          var $model = this;

          // 表格列表
          var GET_MANAGE_LIST = '/api/tztx/seller-manager/seller/select/newList';
          $model.getManageList = function (data) {
            return request.$Search(GET_MANAGE_LIST, data)
          }

          // 省
          var GET_MANAGE_PROVINCE = '/api/tztx/seller-manager/region/province';
          $model.getManageProvince = function () {
            return request.$Search(GET_MANAGE_PROVINCE, {}, true)
          }

          // 市
          var GET_MANAGE_CITY = '/api/tztx/seller-manager/region/newCity';
          $model.getManageCity = function (data) {
            return request.$Search(GET_MANAGE_CITY, data, true)
          }

          // 区/县
          var GET_MANAGE_COUNTRY = '/api/tztx/seller-manager/region/newDistrict';
          $model.getManageCountry = function (data) {
            return request.$Search(GET_MANAGE_COUNTRY, data, true)
          }

          // 新增保存
          var NEW_MANAGE_SAVE = '/api/tztx/seller-manager/seller/addSeller';
          $model.newManageSave = function (data) {
            return request.$Search(NEW_MANAGE_SAVE, data)
          }

          // 详情
          var GET_MANAGE_DETIAL = '/api/tztx/seller-manager/seller/select/detail';
          $model.getManageDetial = function (data) {
            return request.$Search(GET_MANAGE_DETIAL, data)
          }

          // 上下架
          var GET_MANAGE_DETIAL = '/api/tztx/seller-manager/seller/select/detail';
          $model.getManageDetial = function (data) {
            return request.$Search(GET_MANAGE_DETIAL, data)
          }







            var PROVINCE_JSON_DATA = '/api/tztx/seller-manager/region/province';
            var CITY_JSON_DATA = '/api/tztx/seller-manager/region/city';
            var AREA_JSON_DATA = '/api/tztx/seller-manager/region/district';
            var ERWEI_JSON_DATA = '/api/tztx/seller-manager/order/select/list';
            var RETURN_JSON_DATA = '/api/tztx/seller-manager/seller/select/detail';
            //审核数据approval
            var APPROVAL_JSON_DATA = '/api/tztx/seller-manager/seller/approval';
            // 二维码订单导出
            //数据详情零售户
            var FXLIST_JSON_DATA = '/api/tztx/seller-manager/seller/select/fxlist';
            var TIXIAN_JSON_DATA = '/api/tztx/seller-manager/seller/select/tx';
            var UCOUNT_JSON_DATA = '/api/tztx/seller-manager/seller/select/ucount';
            var DETAIL_JSON_DATA = '/api/tztx/seller-manager/seller/select/detail';



        }]
    };
    return visitManageModel;
})