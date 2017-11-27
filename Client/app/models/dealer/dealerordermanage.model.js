/**
 * Author: zhaobaoli
 * Create Date: 2017-11-23
 * Description: interface
 */
define([], function () {
    var dealerordermanageModel = {
        ServiceType: "service",
        ServiceName: "dealerordermanageViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
            	var province = '/api/tztx/dataportal/fxback/getProvince';//省份
            	var getCity = '/api/tztx/dataportal/fxback/getCity';//地市
            	var getArea = '/api/tztx/dataportal/fxback/getCountry';//区县
            	var orderStates = '/api/tztx/dataportal/fxback/getOrderStatus';//订单状态
            	var getOrderList = '/api/tztx/dataportal/fxback/getOrders';//订单列表
				var orderTrackUrl ='/api/tztx/dataportal/fxback/getOrderTrack'; //订单跟踪
				var updateAdressUrl ='/api/tztx/dataportal/fxback/modifyOrderAddress'; //修改收货地址
				var getOrderDetailUrl ='/api/tztx/dataportal/fxback/getOrderDetail'; //修改收货地址
				var cancelOrderUrl ='/api/tztx/dataportal/fxback/cancelOrder'; //取消订单

            	
               	this.$orderStates = function () {
         			 return request.$Search(orderStates,{},true);
      			}
               	this.$province = function () {
         			 return request.$Search(province,{},true);
      			}
               	this.$getCity = function (params) {
         			 return request.$Search(getCity,params,true);
      			}
               	this.$getArea = function (params) {
         			 return request.$Search(getArea,params,true);
      			}
      			this.$getOrderList = function (params) {
         			 return request.$Search(getOrderList,params,true);
      			}
				this.$getOrderTrack = function (params) {
         			 return request.$Search(orderTrackUrl,params,true);
      			}
				this.$updateAdress = function (params) {
         			 return request.$Search(updateAdressUrl,params,true);
      			}
				this.$getOrderDetail = function (params) {
         			 return request.$Search(getOrderDetailUrl,params,true);
      			}
				this.$cancelOrder = function (params) {
         			 return request.$Search(cancelOrderUrl,params,true);
      			}
            };
        }]
    };
    return dealerordermanageModel;
});