/**
 * [description]
 * @param  {Object} ) {    var        rewardModel [description]
 * @return {[type]}   [description]
 */
define([], function () {
	var rewardModel = {
		ServiceType: "service",
    	ServiceName: "rewardViewModel",
    	ServiceContent: ['request', function (request) {
    		this.$model = function () {
                var INTRODUCTION_JSON_DATA = '/api/tztx/seller-manager/setting/introduction';
                var AWARD_JSON_DATA = '/api/tztx/seller-manager/setting/seller/award';
                var QR_JSON_DATA = '/api/tztx/seller-manager/setting/qr';
                var CONSUMER_JSON_DATA = '/api/tztx/seller-manager/setting/seller/consumer';
                var SELECT_JSON_DATA = '/api/tztx/seller-manager/setting/select';
                // 二维码设置历史记录
                var HIS_JSON_DATA = '/api/tztx/seller-manager/setting/qr/his';
                // 获取表格数据
                this.getIntroduction = function (params) {
                    return request.$Search(INTRODUCTION_JSON_DATA, params);
                };
                this.getAward = function (params) {
                    return request.$Search(AWARD_JSON_DATA, params);
                };
    			// 获取表格数据
                this.getIntroduction = function (params) {
                    return request.$Search(INTRODUCTION_JSON_DATA, params);
                };
    			this.getAward = function (params) {
    				return request.$Search(AWARD_JSON_DATA, params);
    			};
                this.getQr = function (params) {
                    return request.$Search(QR_JSON_DATA, params);
                };
                this.getConsumer = function (params) {
                    return request.$Search(CONSUMER_JSON_DATA, params);
                };
                this.$his = request.$Search(HIS_JSON_DATA);
                this.$select = request.$Search(SELECT_JSON_DATA);
            };
        }]
    };
    return rewardModel;
});