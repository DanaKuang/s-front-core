/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */
define([], function () {
    var visitReviewManageModel = {
        ServiceType: "service",
        ServiceName: "visitReviewManageModel",
        ServiceContent: ['request', function (request) {

          //定义资源
          var $model = this;

          // 表格列表
          var GET_MANAGE_LIST = '/api/tztx/seller-manager/seller/select/newList';
          $model.getReviewManageList = function (data) {
            return request.$Search(GET_MANAGE_LIST, data)
          }

          // 省
          var GET_MANAGE_PROVINCE = '/api/tztx/seller-manager/region/province';
          $model.getReviewManageProvince = function () {
            return request.$Search(GET_MANAGE_PROVINCE, {}, true)
          }

          // 市
          var GET_MANAGE_CITY = '/api/tztx/seller-manager/region/newCity';
          $model.getReviewManageCity = function (data) {
            return request.$Search(GET_MANAGE_CITY, data, true)
          }

          // 区/县
          var GET_MANAGE_COUNTRY = '/api/tztx/seller-manager/region/newDistrict';
          $model.getReviewManageCountry = function (data) {
            return request.$Search(GET_MANAGE_COUNTRY, data, true)
          }

          // 审核
          var REVIEW_MANAGE = '/api/tztx/seller-manager/seller/approvalBatch';
          $model.reviewAndPass = function (data) {
            return request.$Search(REVIEW_MANAGE, data)
          }
        }]
    };
    return visitReviewManageModel;
})