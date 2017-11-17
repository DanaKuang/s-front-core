/**
 * Author: {author}
 * Create Date: 2017-10-16
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

            	
               this.$orderStates = function () {
               	
         			 return request.$Search(orderStates,{},true);
      			}
               this.$province = function () {
               	
         			 return request.$Search(province,{},true);
      			}
               this.getCity = function (params) {
               	
         			 return request.$Search(getCity,params,true);
      			}
               this.getArea = function (params) {
               	
         			 return request.$Search(getArea,params,true);
      			}
      			this.$getOrderList = function (params) {
               	
         			 return request.$Search(getOrderList,params,true);
      			}
            };
        }]
    };
    return dealerordermanageModel;
});