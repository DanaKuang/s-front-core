/**
 * Author: {author}
 * Create Date: 2017-07-04
 * Description: visit
 */

define([], function () {
  var supplyModel = {
    ServiceType: 'service',
    ServiceName: 'supplyViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {

        console.log("supply model");
        var commentUrl = '/api/tztx/saas/saotx/common/querySupplierCompliance';  //合规评估维度值
        var supListUrl = '/api/tztx/saas/saotx/supplier/queryList';  //供应商管理列表
        var savaOrUpdateUrl = '/api/tztx/saas/saotx/supplier/saveOrUpdate'; //供应商新增或修改
        var modifySupplierStatusUrl = '/api/tztx/saas/saotx/supplier/modifySupplierStatus'; //修改供应商状态
        var fileUploadUrl = '/api/tztx/saas/saotx/attach/commonUploadFiles'; //文件上传
        var querySupplierUrl = '/api/tztx/saas/saotx/supplier/querySupplierByCode';//根据供应商编码查询供应商的详细数据

        
        this.getComment = function () {
          return request.$Query(commentUrl);
        };
        this.getSupList = function (params) {
          return request.$Search(supListUrl,params);
        };
        this.saveOrUpdateData = function(params){
          return request.$Search(savaOrUpdateUrl,params);
        };
        this.modifySupplierStatus = function(params){
          return request.$Search(modifySupplierStatusUrl,params);
        };
        this.fileUpload = function(params){
          return request.$Search(fileUploadUrl,params);
        };
        this.querySupplierByCode = function(params){
          return request.$Search(querySupplierUrl,params);
        };

      };
    }]
  };

  return supplyModel;
});