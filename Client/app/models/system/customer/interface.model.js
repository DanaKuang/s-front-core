/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function () {
    var interfaceModel = {
        ServiceType: "service",
        ServiceName: "interfaceViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
             var getActivityList = '/api/tztx/saas/admin/sys/querytAllOrgParam';//接口管理列表接口
             var getActivityListsss = '/api/tztx/saas/saotx/wechat/queryWechatByOrgCode';//判断接口
             var saveOrUpdateData = '/api/tztx/saas/saotx/wechat/saveOrUpdateInter';//保存微信管理
             var saveOrUpdateDataTwo = '/api/tztx/saas/saotx/wechat/saveOrUpdatePay';//保存支付接口
             var getSelectOptions = '/api/tztx/saas/saotx/wechat/queryListPlatForm';//下拉框
			this.$getActivityList = function(params){
		 		 return request.$Search(getActivityList,params,true);
		}
			this.$getActivityListsss = function(params){
		 		 return request.$Search(getActivityListsss,params,true);
		}
			this.$saveOrUpdateData = function(params){
		 		 return request.$Search(saveOrUpdateData,params,true);
		}
			this.$saveOrUpdateDataTwo = function(params){
		 		 return request.$Search(saveOrUpdateDataTwo,params,true);
		}
			this.$getSelectOptions = function(){
		 		 return request.$Search(getSelectOptions,{},true);
		}
            };
        }]
    };
    return interfaceModel;
});