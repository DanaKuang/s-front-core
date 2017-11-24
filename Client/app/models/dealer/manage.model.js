/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商管理
 */

define([], function () {
  var manageModel = {
    ServiceType: 'service',
    ServiceName: 'manageModel', // 这里如果是给controller引用的话，那下面的return是什么..
    ServiceContent: ['request', function (request) {

      //定义资源
      var $model = this;

      // 表格列表
      var GET_MANAGE_LIST = '/api/tztx/dataportal/fxback/getApprovaledSalers';
      $model.getManageList = function (data) {
        return request.$Search(GET_MANAGE_LIST, data, true)
      }

      // 省
      var GET_MANAGE_PROVINCE = '/api/tztx/dataportal/fxback/getProvince';
      $model.getManageProvince = function () {
        return request.$Search(GET_MANAGE_PROVINCE, {}, true)
      }

      // 市
      var GET_MANAGE_CITY = '/api/tztx/dataportal/fxback/getCity';
      $model.getManageCity = function (data) {
        return request.$Search(GET_MANAGE_CITY, data, true)
      }

      // 区/县
      var GET_MANAGE_COUNTRY = '/api/tztx/dataportal/fxback/getCountry';
      $model.getManageCountry = function (data) {
        return request.$Search(GET_MANAGE_COUNTRY, data, true)
      }

      // 启用、禁止
      var MANAGE_UPDATE_SALERS = '/api/tztx/dataportal/fxback/updateSalers';
      $model.updateSalers = function (data) {
        return request.$Search(MANAGE_UPDATE_SALERS, data, true)
      }


      // 详情 - 顶部详细信息
      var GET_SALER_DETIAL = '/api/tztx/dataportal/fxback/getSalerDetail';
      $model.getSalerDetail = function (data) {
        return request.$Search(GET_SALER_DETIAL, data, true)
      }

      // TA的团队列表
      var GET_TEAM_LIST = '/api/tztx/dataportal/fxback/getTeamList';
      $model.getTeamList = function (data) {
        return request.$Search(GET_TEAM_LIST, data, true)
      }

      // 佣金明细列表
      var GET_COMMISSION_LIST = '/api/tztx/dataportal/fxback/getMyCommission';
      $model.getMyCommission = function (data) {
        return request.$Search(GET_COMMISSION_LIST, data, true)
      }

      // 提现记录列表
      var GET_WITHDRAW_LIST = '/api/tztx/dataportal/fxback/getMyWithDraw';
      $model.getMyWithDraw = function (data) {
        return request.$Search(GET_WITHDRAW_LIST, data, true)
      }

      // 推广订单明细列表
      var GET_MTORDERS_LIST = '/api/tztx/dataportal/fxback/getMyOrders';
      $model.getMyOrders = function (data) {
        return request.$Search(GET_MTORDERS_LIST, data, true)
      }

      // 详情 - 佣金明细 - 我的团队下拉框
      var GET_MY_TEAM = '/api/tztx/dataportal/fxback/getMyTeam';
      $model.getMyTeam = function (data) {
        return request.$Search(GET_MY_TEAM, data, true)
      }



      
    }]
  }
  return manageModel
})
