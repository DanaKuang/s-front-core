/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
  var kpiModel = {
    ServiceType: "service",
    ServiceName: "kpiViewModel",
    ServiceContent: ['request', '$filter', function (request, $filter) {
      this.$model = function () {
        var historyParams = {
          'provinceName': '湖北',
          'statTime': $filter("date")((+new Date - 60*60*24*1000), 'yyyy-MM-dd'),
          'statType': 'day'
        };
        var CHINA_JSON_URL = '/statics/home/kpi/china.json';           // 地图JSON
        var ECHART_JSON_CONF = '/statics/home/kpi/echartConf.json';    // echart配置

        var SALES_JSON_CONF = '/statics/home/kpi/salesTblConf.json';   // table配置
        var FORMAT_JSON_CONF = '/statics/home/kpi/formatTblConf.json';
        var SF_JSON_CONF = '/statics/home/kpi/sfTblConf.json';

        var TIME_JSON_URL = '/api/tztx/dataportal/data/dayScanTimes';             // 当日扫码次数
        var USER_JSON_URL = '/api/tztx/dataportal/data/dayScanUsers';             // 当日扫码人数
        var CODE_JSON_URL = '/api/tztx/dataportal/data/dayScanCodes';             // 当日扫码烟包数
        var HISTORY_JSON_URL = '/api/tztx/dataportal/statistics/getScanData';     // 历史扫码数据

        var SCORLL_JSON_URL = '/api/tztx/dataportal/data/rollingData';            // 实时滚动数据
        var TOP10_JSON_URL = '/api/tztx/dataportal/data/topTen';                  // TOP10数据
        var MAPDATA_JSON_URL = '/api/tztx/dataportal/data/mapdata';               // 地图数据

        var PROVINCE_JSON_URL = '/api/tztx/dataportal/data/getProvinceKPI';       // 省份指标
        var SPECIFIC_JSON_URL = '/api/tztx/dataportal/data/getSpecificationKPI';  // 规格指标
        var FIRSTTIME_JSON_URL = '/api/tztx/dataportal/statistics/firstTimeScan'; // 销区与规格
        var CITY_JSON_URL = '/api/tztx/dataportal/data/getCityKPI';               // 城市列表

        this.$chinaJson = request.$Query(CHINA_JSON_URL);
        this.$echartConf = request.$Query(ECHART_JSON_CONF);

        this.$salesConf = request.$Query(SALES_JSON_CONF);
        this.$formatConf = request.$Query(FORMAT_JSON_CONF);
        this.$sfConf = request.$Query(SF_JSON_CONF);

        this.$mapData = request.$Search(MAPDATA_JSON_URL);                        // 地图数据
        this.$salesData = request.$Search(PROVINCE_JSON_URL, {key:'scantimes'});
        this.$formatData = request.$Search(SPECIFIC_JSON_URL, {key: 'scantimes'});
        this.$fscanData = request.$Search(FIRSTTIME_JSON_URL);

        this.$historyScan = request.$Search(HISTORY_JSON_URL, historyParams, true);

        // 请求数据封装成函数，实时调用
        // 获取实时扫码数
        this.getScanTime = function () {
          return request.$Search(TIME_JSON_URL, {});
        };
        // 当日扫码人数
        this.getScanUser = function () {
          return request.$Search(USER_JSON_URL);
        };
        // 当日扫码烟包数
        this.getScanCode = function () {
          return request.$Search(CODE_JSON_URL);
        };
        // 实时滚动
        this.getScrollData = function () {
          return request.$Search(SCORLL_JSON_URL);
        };
        // TOP10数据
        this.getTopTen = function () {
          return request.$Search(TOP10_JSON_URL);
        };
        // 省份指标
        this.getProvinceKPI = function () {
          return request.$Search(PROVINCE_JSON_URL);
        };
        // 规格指标
        this.getSpecificationKPI = function () {
          return request.$Search(SPECIFIC_JSON_URL);
        };
        // 城市列表
        this.getCityKPI = function () {
          return request.$Search(CITY_JSON_URL);
        };
        // 地图数据
        this.getMapData = function () {
          return request.$Search(MAPDATA_JSON_URL);
        };

      };
    }]
  };

  return kpiModel;
});