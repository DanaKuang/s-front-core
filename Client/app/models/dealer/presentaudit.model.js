/**
* Author: zhaobaoli
 * Create Date: 2017-11-27
 * Description: 提现审核
 */
define([], function () {
    var presentauditModel = {
        ServiceType: "service",
        ServiceName: "presentauditViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var province = '/api/tztx/dataportal/fxback/getProvince';//省份
            	var getCity = '/api/tztx/dataportal/fxback/getCity';//地市
            	var getArea = '/api/tztx/dataportal/fxback/getCountry';//区县
                var getWithDrawsUrl = '/api/tztx/dataportal/fxback/getWithDraws';//获取提现列表
                var aduitOperateUrl = '/api/tztx/dataportal/fxback/auditWithdraw'; //提现审核操作

                this.$province = function () {
         			 return request.$Search(province,{},true);
      			}
               	this.$getCity = function (params) {
         			 return request.$Search(getCity,params,true);
      			}
               	this.$getArea = function (params) {
         			 return request.$Search(getArea,params,true);
      			}
                this.$getWithDrawsList = function (params) {
         			 return request.$Search(getWithDrawsUrl,params,true);
      			}
                this.$aduitOperate = function (params) {
         			 return request.$Search(aduitOperateUrl,params,true);
      			}
            };
        }]
    };
    return presentauditModel;
});