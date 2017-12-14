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


          // *** 审核管理 start
          // 审核
          var REVIEW_MANAGE = '/api/tztx/seller-manager/seller/approvalBatch';
          $model.reviewAndPass = function (data) {
            return request.$Search(REVIEW_MANAGE, data)
          }
          // *** 审核管理 end


          // *** 零售户管理 start
          // 新增保存、编辑保存
          var NEW_MANAGE_SAVE = '/api/tztx/seller-manager/seller/saveOrUpdateSeller';
          $model.newManageSave = function (data) {
            return request.$Search(NEW_MANAGE_SAVE, data)
          }

          // 详情
          var GET_MANAGE_DETIAL = '/api/tztx/seller-manager/seller/select/detail';
          $model.getManageDetialInfo = function (data) {
            return request.$Search(GET_MANAGE_DETIAL, data)
          }

          // 详情 - 店铺粉丝
          var GET_MANAGE_DETIAL_FANS = '/api/tztx/seller-manager/seller/querySellerFans';
          $model.getManageDetialSellerFans = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_FANS, data)
          }

          // 详情 - 扫码返现
          var GET_MANAGE_DETIAL_BACK = '/api/tztx/seller-manager/seller/select/newFxlist';
          $model.getManageDetialCashback = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_BACK, data)
          }

          // 详情 - 账单流水
          var GET_MANAGE_DETIAL_BILL = '/api/tztx/seller-manager/seller/accountFlow';
          $model.getManageDetialBill = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_BILL, data)
          }

          // 详情 - 入库明细
          var GET_MANAGE_DETIAL_STORAGE = '/api/tztx/seller-manager/seller/scanInstore';
          $model.getManageDetialStorage = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_STORAGE, data)
          }

          // 上下架
          var GET_MANAGE_AUTHORG = '/api/tztx/seller-manager/seller/modifyAuthOrg';
          $model.modifyAuthOrg = function (data) {
            return request.$Search(GET_MANAGE_AUTHORG, data)
          }
          // *** 零售户管理 end


          // *** 其他系统配置 start
          var OTHER_SETTING = '/api/tztx/seller-manager/setting/sellerSysSetting';
          $model.sellerSysSetting = function (data) {
            return request.$Search(OTHER_SETTING, data, true)
          }
          // *** 其他系统配置 end

        }]
    };
    return visitManageModel;
})