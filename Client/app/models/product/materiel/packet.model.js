/**
 * Author: {zhaobaoli}
 * Create Date: 2017-08-05
 * Description: visit
 */

define([], function () {
  var packetModel = {
    ServiceType: 'service',
    ServiceName: 'packetViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {

        var supplyListUrl = '/api/tztx/saas/saotx/supplier/queryList';  //获取供应商列表
        var brandListUrl = '/api/tztx/saas/saotx/common/queryBrandWithRight';  //获取品牌
        var savePacketUrl = '/api/tztx/saas/saotx/poolRedpack/saveOrUpdate';  //新增或修改红包池对象数据
        var packetListUrl = '/api/tztx/saas/saotx/product/queryMetraList'; //获取红包列表
        var dataStatusUrl  = '/api/tztx/saas/saotx/common/queryDimDataStatus'; //获取数据状态
        var addPoolUrl  = '/api/tztx/saas/saotx/poolRedpack/addPool'; //红包池增库
        var modifyPacketStatusUrl  = '/api/tztx/saas/saotx/poolRedpack/modifyStatus'; //修改红包数据状态
        var speciftByBrandUrl  = '/api/tztx/saas/saotx/common/queryProduct'; //修改红包数据状态
        var packetDetailUrl  = '/api/tztx/saas/saotx/metraOper/queryList'; //查询物料（礼品、红包）流水明细列表
        var queryLogUrl  = '/api/tztx/saas/saotx/common/queryLogOper'; //查询物料日志操作动作类型维度接口


        this.getSupplyList = function (params){
          return request.$Search(supplyListUrl,params);
        };
        this.getBrandList = function (){
          return request.$Search(brandListUrl);
        };
        this.savePacketData = function (params){
          return request.$Search(savePacketUrl,params);
        };
        this.getPacketList = function (params){
          return request.$Search(packetListUrl,params);
        };
        this.getDataStatus = function (){
          return request.$Search(dataStatusUrl);
        };
        this.addPacketPool = function (params){
          return request.$Search(addPoolUrl,params);
        };
        this.modifyPacketStatus = function (params){
          return request.$Search(modifyPacketStatusUrl,params);
        };
        this.getSpeciftByBrand = function(params){
          return request.$Search(speciftByBrandUrl,params);
        };
        this.getPacketDetail = function(params){
          return request.$Search(packetDetailUrl,params);
        };
        this.getQueryLog = function(){
          return request.$Search(queryLogUrl);
        }

      };
    }]
  };

  return packetModel;
});