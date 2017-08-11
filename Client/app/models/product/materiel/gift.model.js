/**
 * Author: {zhaobaoli}
 * Create Date: 2017-08-05
 * Description: visit
 */

define([], function () {
  var giftModel = {
    ServiceType: 'service',
    ServiceName: 'giftViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {

        var giftTypeUrl = '/api/tztx/saas/saotx/common/queryDimAwardType';  //礼品类型。1-实物；2-红包；3-卡券；4-积分
        var supplyListUrl = '/api/tztx/saas/saotx/supplier/queryList';  //获取供应商列表
        var brandListUrl = '/api/tztx/saas/saotx/common/queryBrand';  //获取品牌
        var speciftByBrandUrl  = '/api/tztx/saas/saotx/common/queryProduct'; //根据品牌获取适用规格
        var saveOrUpdateDataUrl = '/api/tztx/saas/saotx/poolGift/saveOrUpdate'; //新增或修改礼品对象数据
        var giftListUrl = '/api/tztx/saas/saotx/product/queryMetraList'; //获取礼品列表
        var dataStatusUrl  = '/api/tztx/saas/saotx/common/queryDimDataStatus'; //获取数据状态
        var modifygiftStatusUrl  = '/api/tztx/saas/saotx/poolGift/modifyStatus'; //修改礼品数据状态
        var addGiftPoolUrl = '/api/tztx/saas/saotx/poolGift/addPool';  //礼品增库
        var giftDetailUrl  = '/api/tztx/saas/saotx/metraOper/queryList'; //查询物料（礼品、红包）流水明细列表
        var queryActiveUrl  = '/api/tztx/saas/saotx/common/queryLogOper'; //查询物料日志操作动作类型维度接口

        this.getGiftType = function (params){
          return request.$Search(giftTypeUrl,params);
        };
        this.getSupplyList = function (params){
          return request.$Search(supplyListUrl,params);
        };
        this.getBrandList = function (){
          return request.$Search(brandListUrl);
        };
        this.getSpeciftByBrand = function(params){
          return request.$Search(speciftByBrandUrl,params);
        };
        this.saveOrUpdateData = function(params){
          return request.$Search(saveOrUpdateDataUrl,params);
        };
        this.getGiftList = function (params){
          return request.$Search(giftListUrl,params);
        };
        this.getDataStatus = function (){
          return request.$Search(dataStatusUrl);
        };
        this.modifyGiftStatus = function (params){
          return request.$Search(modifygiftStatusUrl,params);
        };
        this.addGiftPool = function (params){
          return request.$Search(addGiftPoolUrl,params);
        };
        this.getGiftDetail = function(params){
          return request.$Search(giftDetailUrl,params);
        };
        this.getActiveValue = function(){
          return request.$Search(queryActiveUrl);
        }

      };
    }]
  };

  return giftModel;
});