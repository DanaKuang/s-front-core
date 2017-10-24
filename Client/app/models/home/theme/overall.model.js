/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: overall
 */

define([], function () {
    var overallModel = {
        ServiceType: 'service',
        ServiceName: 'overallModel',
        ServiceContent: ['request', function (request) {
	        //定义资源
	        var $model = this;

          // 获取当年每周
          var WEEKS = '/api/tztx/dataportal/statistics/getWeeks';

          // 趋势配置
          var TREND_JSON = '/statics/home/overall/trendConf.json'

	        // 地图JSON
	        var CHINA_JSON_URL = '/statics/home/kpi/china.json'; 

	        // 地图配置
	        var MAP_JSON_CONF = '/statics/home/overall/mapConf.json'; 

          // 各规格扫码次数数据
          var ALL_PRODUCT_SCANS = '/statics/home/overall/allproductscans.json';

          // 当年每周
          $model.getweeks = function (data) {
            return request.$Search(WEEKS, data)
          }

          // 趋势配置
          $model.$trendConf = request.$Query(TREND_JSON);

	        // 接口数据
          $model.$chinaJson = request.$Query(CHINA_JSON_URL);

          // 地图配置
          $model.$mapConf = request.$Query(MAP_JSON_CONF);

          // 各规格扫码次数
          $model.$allscans = request.$Query(ALL_PRODUCT_SCANS)
        
        }]
    }
    return overallModel
})
