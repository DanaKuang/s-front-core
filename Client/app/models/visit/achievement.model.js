/**
 * Author: liubin
 * Create Date: 2017-09-28
 * Description: visit
 */

define([], function () {
	var achievementModel = {
		ServiceType: "service",
    	ServiceName: "achievementViewModel",
    	ServiceContent: ['request', function (request) {
    		this.$model = function () {
                var SEARCH_INCOME_DATA = '/api/tztx/seller-manager/income/statis';
    			var SEARCH_DETAIL_DATA = '/api/tztx/seller-manager/income/detail';

    			// 获取表格数据
    			this.getTblStatic = function (params) {
    				return request.$Search(SEARCH_INCOME_DATA, params);
    			};
                this.getTblDetail = function (params) {
                    return request.$Search(SEARCH_DETAIL_DATA, params);
                };
    		};
    	}]
	};
	return achievementModel;
})