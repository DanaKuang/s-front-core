/***/
define([], function () {
	var manageModel = {
		ServiceType: "service",
    	ServiceName: "manageViewModel",
    	ServiceContent: ['request', function (request) {
    		this.$model = function () {
    			var SEARCH_JSON_DATA = '/api/tztx/seller-manager/seller/select/list';
                var PROVINCE_JSON_DATA = '/api/tztx/seller-manager/region/province';
                var CITY_JSON_DATA = '/api/tztx/seller-manager/region/city';
                var AREA_JSON_DATA = '/api/tztx/seller-manager/region/district';
                var ERWEI_JSON_DATA = '/api/tztx/seller-manager/order/select/list';
                var RETURN_JSON_DATA = '/api/tztx/seller-manager/seller/select/detail';
                //审核数据approval
                var APPROVAL_JSON_DATA = '/api/tztx/seller-manager/seller/approval';
                // 二维码订单导出
                //数据详情零售户
                var RETURN_JSON_DATA = '/api/tztx/seller-manager/seller/select/fxlist';
                var TIXIAN_JSON_DATA = '/api/tztx/seller-manager/seller/select/tx';
                var UCOUNT_JSON_DATA = '/api/tztx/seller-manager/seller/select/ucount';
                var DETAIL_JSON_DATA = '/api/tztx/seller-manager/seller/select/detail';
                //订单物流信息导入
                var INFO_JSON_DATA = '/api/tztx/seller-manager/import/tracking/info';
    			// 获取表格数据
    			this.getTblData = function (params) {
    				return request.$Search(SEARCH_JSON_DATA, params);
    			};
                this.getTbErwei = function (params) {
                    return request.$Search(ERWEI_JSON_DATA, params);
                };
                this.$province = request.$Search(PROVINCE_JSON_DATA);
                this.$info = request.$Search(INFO_JSON_DATA);
                this.getCity = function (params) {
                    return request.$Search(CITY_JSON_DATA, params);
                };
                this.getArea = function (params) {
                    return request.$Search(AREA_JSON_DATA, params);
                }; 
                //审核
                this.getApproval = function (params) {
                    return request.$Search(APPROVAL_JSON_DATA, params);
                };

                //零售户详情
                 this.getReturn = function (params) {
                    return request.$Search(RETURN_JSON_DATA, params);
                };
                this.getTixian = function (params) {
                    return request.$Search(TIXIAN_JSON_DATA, params);
                };
                this.getCount = function (params) {
                    return request.$Search(UCOUNT_JSON_DATA, params);
                };
                // this.getDetail = request.$Search(DETAIL_JSON_DATA);
                this.getDetail = function (params) {
                    return request.$Search(DETAIL_JSON_DATA, params);
                };
                // this.getPrint = function (params) {
                //     return request.$Search(PRINT_JSON_DATA, params);
                // };
                
    		};
    	}]
	};
	return manageModel;
})