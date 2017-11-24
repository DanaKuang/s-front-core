/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商管理
 */

define([], function () {
  var reviewModel = {
    ServiceType: 'service',
    ServiceName: 'reviewModel', // 这里如果是给controller引用的话，那下面的return是什么..
    ServiceContent: ['request', function (request) {

      // 定义资源
      var $model = this;

      // 表格列表
      var GET_REVIEW_LIST = '/api/tztx/dataportal/fxback/getSalers';
      $model.getReviewList = function (data) {
        return request.$Search(GET_REVIEW_LIST, data, true)
      }

      // 省
      var GET_REVIEW_PROVINCE = '/api/tztx/dataportal/fxback/getProvince';
      $model.getReviewProvince = function () {
        return request.$Search(GET_REVIEW_PROVINCE, {}, true)
      }

      // 市
      var GET_REVIEW_CITY = '/api/tztx/dataportal/fxback/getCity';
      $model.getReviewCity = function (data) {
        return request.$Search(GET_REVIEW_CITY, data, true)
      }

      // 区/县
      var GET_REVIEW_COUNTRY = '/api/tztx/dataportal/fxback/getCountry';
      $model.getReviewCountry = function (data) {
        return request.$Search(GET_REVIEW_COUNTRY, data, true)
      }

      // 审核
      var REVIEW_APPROVAL = '/api/tztx/dataportal/fxback/approvalSalers';
      $model.approvalSalers = function (data) {
        return request.$Search(REVIEW_APPROVAL, data, true)
      }

    }]
  }
  return reviewModel
})
