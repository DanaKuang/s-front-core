/**
 * Author: zhaobaoli
 * Create Date: 2018-06-20
 * Description: auditManageModel 自建商品管理
 */

define([], function () {
    var auditManageModel = {
      ServiceType: 'service',
      ServiceName: 'auditManageModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {
            var getAuditListUrl = '/api/tztx/saas/saotx/mall/order/authList';  //获取京东审核订单列表
            var modifyAuditOrderUrl = '/api/tztx/saas/saotx/mall/order/authOrder'; //京东订单审核
            
            this.getAuditList = function (params){
                return request.$Search(getAuditListUrl,params,true);
            };
            this.modifyAuditOrder = function (params){
                return request.$Search(modifyAuditOrderUrl,params,true);
            };
           
        };
      }]
    };
  
    return auditManageModel;
  });