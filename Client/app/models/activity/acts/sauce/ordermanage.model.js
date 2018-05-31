/**
 * Author: zhaobaoli
 * Create Date: 2018-03-06
 * Description: 活动管理(订单管理)接口
 */
define([], function () {
    var actordermanageModel = {
        ServiceType: "service",
        ServiceName: "actOrderManageViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
            	var getProvince = '/api/tztx/dataportal/fxback/getProvince';//省份
            	var getCity = '/api/tztx/dataportal/fxback/getCity';//地市
                var getArea = '/api/tztx/dataportal/fxback/getCountry';//区县
                var getOrderListUrl = '/api/tztx/xj/order/list'; //订单管理列表
                var getOrderDetailByIdUrl = '/api/tztx/xj/order/detail'; //根据订单id获取订单详情
                var actListUrl = '/api/tztx/xj/activity/list';//活动列表
                var getAwardLevelsUrl = '/api/tztx/xj/award/listLevel'; //获取活动配置奖项等级
                var updateTrackAddressUrl = '/api/tztx/xj/order/modify/addressInfo'; //修改收货地址
                
               	this.$getProvince = function () {
         			 return request.$Search(getProvince,{},true);
      			}
               	this.$getCity = function (params) {
         			 return request.$Search(getCity,params,true);
      			}
               	this.$getArea = function (params) {
         			 return request.$Search(getArea,params,true);
                }
                this.$getOrderList = function (params) {
                    return request.$Search(getOrderListUrl,params,true);
                }
                this.$getOrderDetailById = function (params) {
                    return request.$Search(getOrderDetailByIdUrl,params,true);
                }
                this.$getActList = function () {
                    return request.$Search(actListUrl,{},true);
                }
                this.$getAwardLevels = function (params) {
                    return request.$Search(getAwardLevelsUrl,params,true);
                }
                this.$updateTrackAddress = function (params) {
                    return request.$Search(updateTrackAddressUrl,params,true);
                }
                
      			
            };
        }]
    };
    return actordermanageModel;
});