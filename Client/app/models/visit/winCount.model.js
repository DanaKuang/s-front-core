/***/

define([], function () {
	var winCountModel = {
		ServiceType: "service",
    	ServiceName: "winCountViewModel",
    	ServiceContent: ['request', function (request) {
    		this.$model = function () {
    			// var SEARCH_JSON_DATA = '/api/tztx/seller-manager/seller/select/list';


    			// 获取表格数据
    			this.getTblData = function (params) {
    				return request.$Search(SEARCH_JSON_DATA, params);
    			};
    		};
    	}]
	};
	return winCountModel;
})