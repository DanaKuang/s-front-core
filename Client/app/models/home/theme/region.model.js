/**
 * Author: jinlinyong
 * Create Date: 2017-07-04
 * Description: theme
 */

define([], function () {
  var regionModel = {
    ServiceType: 'service',
    ServiceName: 'regionViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        var stattime = new Date().getFullYear()+"-"+(new Date().getMonth()+1)   +"-"+new Date().getDate();
        var Default =  {"provinceName":"湖南省","statTime":stattime,"statType":"day"}
        var hourDefault =  {"provinceName":"湖南省","statTime":stattime,"statType":"day","flag":1}
        var GAUGE_JSON_URL = '/statics/home/region/gauge.json';         //仪表盘
        var HOURS_JSON_URL = '/statics/home/region/hoursChart.json';     //扫码次数时刻趋势
        var DEFAULT_JSON_URL = '/statics/home/region/planDefault.json';     //扫码次数时刻趋势折线图基本配置
        var PLAN_JSON_URL = '/statics/home/region/plan.json';     //扫码次数时间趋势
        var BAG_JSON_URL = '/statics/home/region/bag.json';       //扫码包数时间趋势
        var NAME_JSON_URL = '/statics/home/region/name.json';     //各规格扫码次数
        var CITY_JSON_URL = '/statics/home/region/city.json';    //各市地扫码次数

        var getProvince = '/api/tztx/dataportal/statistics/getProvince';  //省份下拉列表
        var getWeeks = '/api/tztx/dataportal/statistics/getWeeks';  //周下拉列表
        var hourTrend = '/api/tztx/dataportal/statistics/scanTimesHourTrend';  //时刻分析图
        var getScanData = '/api/tztx/dataportal/statistics/getScanData';  //仪表盘后台数据
        var scanTimes ='/api/tztx/dataportal/statistics/scanTimesOfProvAndSpec'; //各规格扫码次数
        var City = "/api/tztx/dataportal/statistics/scanTimesOfCity";  //地市
        var timeTrend = "/api/tztx/dataportal/statistics/scanTimesTrend" //扫码次数时间趋势
        var bagTrend = "/api/tztx/dataportal/statistics/scanCodesOfProvince" //扫码包数时间趋势


        this.$gaugechart = request.$Query(GAUGE_JSON_URL);
        this.$hourschart = request.$Query(HOURS_JSON_URL);
        this.$Default = request.$Query(DEFAULT_JSON_URL);
        this.$planchart = request.$Query(PLAN_JSON_URL);
        this.$bagchart = request.$Query(BAG_JSON_URL);
        this.$namechart = request.$Query(NAME_JSON_URL);
        this.$citychart = request.$Query(CITY_JSON_URL);

        this.$getProvince = function(){
          return request.$Search(getProvince,{},true);
        }
        this.$getWeeks = function(){
          return request.$Search(getWeeks,{},true);
        }
        this.$hourTrend = function(params){
          var params = params || hourDefault;
          params.flag = 1;
          return request.$Search(hourTrend,params,true);
        }
        this.$getScanData = function(options){
          var params = options || Default;
         return request.$Search(getScanData,params,true);
        }
        this.$scanTimes = function(options){
          var params = options || Default;
          return request.$Search(scanTimes,params,true);
        }
        this.$City = function (options) {
          var params = options || Default;
          return request.$Search(City,params,true);
        }
        this.$timeTrend = function(options){
          var params = options || Default;
          return request.$Search(timeTrend,params,true)
        }
        this.$bagTrend = function(options){
          var params = options || Default;
          return request.$Search(bagTrend,params,true)
        }
      };
    }]
  };

  return regionModel;
});