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
	        // var $model = this;

          this.$model = function () {
            // echarts配置静态资源 ---start

            // 扫码趋势
            var TREND_CONF = '/statics/home/overall/trendConf.json'

            // 地图JSON
            var CHINA_JSON_URL = '/statics/home/kpi/china.json'; 

            // 地图配置
            var MAP_JSON_CONF = '/statics/home/overall/mapConf.json';

            // 点击地图所获得区域
            var DISTRICT_CONF = '/statics/home/overall/districtConf.json'

            // 各规格扫码次数
            var SPEC_CONF = '/statics/home/overall/specConf.json';

            // 用户数分析
            var USER_CONF = '/statics/home/overall/userConf.json';

            // 烟包数分析
            var PACK_CONF = '/statics/home/overall/packConf.json';

            // 促销效果
            var RESULT_CONF = '/statics/home/overall/resultConf.json'

            this.$trendConf = request.$Query(TREND_CONF);
            this.$chinaJson = request.$Query(CHINA_JSON_URL);
            this.$mapConf = request.$Query(MAP_JSON_CONF);
            this.$districtConf = request.$Query(DISTRICT_CONF);
            this.$specConf = request.$Query(SPEC_CONF);
            this.$userConf = request.$Query(USER_CONF);
            this.$packConf = request.$Query(PACK_CONF);
            this.$resultConf = request.$Query(RESULT_CONF);

            // echarts配置静态资源 ---end

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

  	         
            // 每周
            this.getweeks = function () {
              return request.$Search(WEEKS, {}, true)
            }

            // 地域分析
            this.zone = function (data) {
              return request.$Search(ZONE, data, true)
            }

            // 所选省份
            this.province = function (data) {
              return request.$Search(PROVINCE, data, true);
            }

            // 扫码趋势、人数、促销效果
            this.scan_people_promotion = function (data) {
              return request.$Search(SCAN_PEOPLE_PROMOTION, data, true)
            }

            // 扫码烟包数分析
            this.packet = function (data) {
              return request.$Search(PACKET, data, true)
            }

            // 各规格扫码数分析 
            this.various = function (data) {
              return request.$Search(VARIOUS_SN, data, true)
            }

          }
        }]
    }
    return overallModel
})
