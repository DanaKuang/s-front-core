define([], function() {
	var labelmanageModel = {
		ServiceType: 'service',
		ServiceName: 'labelmanageViewModel',
		ServiceContent: ['request', function(request) {
			this.$model = function() {
				var getFirstLabelList = '/api/tztx/dataportal/statistics/getFirstLevelAttr'; //一级标签
				var getSecondLabelList = '/api/tztx/dataportal/statistics/getSecondLevelAttr'; //二级标签
				var getThirdLabelList = '/api/tztx/dataportal/statistics/getThirdLevelAttr'; //三级标签
				var getSaleZoneLabelList = '/api/tztx/dataportal/statistics/getSaleZone'; //销区
				
				var getProvinceLabelList = '/api/tztx/dataportal/statistics/getProvince'; //省份
				var getCitysByProvinceLabelList = '/api/tztx/dataportal/statistics/getCitysByProvince'; //地市
				var getProductOfNoNuitList = '/api/tztx/dataportal/statistics/getProductOfNoNuit'; //烟品偏好
				this.$getFirstLabelList = function(params) {
					return request.$Search(getFirstLabelList, params, true);
				};
				this.$getSecondLabelList = function(params) {
					return request.$Search(getSecondLabelList, params, true);
				};
				this.$getThirdLabelList = function(params) {
					return request.$Search(getThirdLabelList, params, true);
				};
				this.$getSaleZoneLabelList = function() {
					return request.$Search(getSaleZoneLabelList,{}, true);
				};
				this.$getProvinceLabelList = function() {
					return request.$Search(getProvinceLabelList,{}, true);
				};
				this.$getCitysByProvinceLabelList = function() {
					return request.$Search(getCitysByProvinceLabelList,{}, true);
				};
				this.$getCitysByProvinceLabelListTwo = function(params) {
					return request.$Search(getCitysByProvinceLabelList,params, true);
				};
				this.$getProductOfNoNuitList = function() {
					return request.$Search(getProductOfNoNuitList,{}, true);
				};
			};
		}]
	};

	return labelmanageModel;
});