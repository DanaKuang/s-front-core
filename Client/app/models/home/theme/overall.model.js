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
          
          // 获取每周
          var WEEKS = '/api/tztx/dataportal/statistics/getWeeks';

          // 扫码次数地域分析
          var ZONE = '/api/tztx/dataportal/statistics/getScanData';

          // 所选省份
          var PROVINCE = '/api/tztx/dataportal/statistics/scanTimesOfCity';

          // 扫码次数趋势、扫码用户数、促销效果趋势分析
          var SCAN_PEOPLE_PROMOTION = '/api/tztx/dataportal/statistics/scanTimesTrend';

          // 扫码烟包数分析
          var PACKET = '/api/tztx/dataportal/statistics/scanCodesOfProvince';

          // 各规格扫码数分析
          // var VARIOUS_SN = '/api/tztx/dataportal/statistics/scanTimesOfProvAndSpec'; 替换成如下：
          var VARIOUS_SN = '/api/tztx/dataportal/statistics/scanTimesofSpec';

	        // 地图JSON
	        var CHINA_JSON_URL = '/statics/home/kpi/china.json'; 

	        // 地图配置
	        var MAP_JSON_CONF = '/statics/home/overall/mapConf.json'; 


          // 每周
          $model.getweeks = function () {
            return request.$Search(WEEKS, {}, true)
          }

          // 地域分析
          $model.zone = function (data) {
            return request.$Search(ZONE, data, true)
          }

          // 所选省份
          $model.province = function (data) {
            return request.$Search(PROVINCE, data, true);
          }

          // 扫码趋势、人数、促销效果
          $model.scan_people_promotion = function (data) {
            return request.$Search(SCAN_PEOPLE_PROMOTION, data, true)
          }

          // 扫码烟包数分析
          $model.packet = function (data) {
            return request.$Search(PACKET, data, true)
          }

          // 各规格扫码数分析 
          $model.various = function (data) {
            return request.$Search(VARIOUS_SN, data, true)
          }

	        // 接口数据
          $model.$chinaJson = request.$Query(CHINA_JSON_URL);

          // 地图配置
          $model.$mapConf = request.$Query(MAP_JSON_CONF);

        
        }]
    }
    return overallModel
})
