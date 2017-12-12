/**
 * Author: jinlinyong
 * Create Date: 2017-07-04
 * Description: theme
 */

define([], function () {
  var specModel = {
    ServiceType: 'service',
    ServiceName: 'specViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        
        var HOURS_JSON_URL = '/statics/home/spec/hourCharts.json';   //扫码次数时刻趋势
        var PLAN_JSON_URL = '/statics/home/spec/plan.json'           //扫码次数时间趋势

        var PEOPLE_JSON_URL = '/statics/home/spec/peopleCharts.json'          //扫码人数时间趋势
        
        var DEFAULT_JSON_URL = '/statics/home/region/planDefault.json';     //扫码次数时刻趋势折线图基本配置
        var CITY_JSON_URL = '/statics/home/spec/city.json'           //各地市扫码次数
        var SCAN_JSON_URL = '/statics/home/spec/award1.json'         //抽奖次数时间趋势
        var MAP_JSON_URL = '/statics/home/spec/map.json'             //地图
        var CHINA_JSON_URL = '/statics/home/kpi/china.json';         // 地图JSON
        var MAP_JSON_CONF = '/statics/home/spec/mapConf.json';   // 地图配置
        var DISTRICT_CONF = '/statics/home/spec/districtConf.json';// 点击地图所获得区域
        var CITY_CHART_CONF = '/statics/home/spec/cityConf.json'; //省内各地市扫码烟包数排名；
        var DRAW_JSON_URL = '/statics/home/spec/draw.json';         // 奖品领取
        var PIE1_JSON_URL = '/statics/home/spec/pie1.json';         // 奖品分布
        var PIE2_JSON_URL = '/statics/home/spec/pie2.json';         // 奖品分布
        var fenBu_JSON_URL = '/statics/home/spec/fenbu.json';


        var getBrand = "/api/tztx/dataportal/public/getUserBrandByUserId";              // 品牌接口        
        var getProduct = '/api/tztx/dataportal/statistics/getProduct';                  //规格
        var getWeeks = '/api/tztx/dataportal/statistics/getWeeks';                      //周下拉列表
        var specification = "/api/tztx/dataportal/statistics/specificationKPI"          //新增扫码人数
        var hourTrend = '/api/tztx/dataportal/statistics/scanTimesHourTrend'; 
                 //时刻分析图
        var peopleTrend = '/api/tztx/statistics/specifScanNumbers';
                //人数趋势分析图；
        var getMap = "/api/tztx/statistics/specifMapData";                       //地图
        var City = "/api/tztx/dataportal/statistics/scanTimesOfCityAndSpec"             //地市
        var timesTrendOfSpec = "/api/tztx/dataportal/statistics/scanTimesTrendOfSpec"   //扫码次数时间趋势
        var drawTimes = "/api/tztx/dataportal/statistics/drawTimesTrendOfSpec"          //奖品领取
        var getAward = "/api/tztx/dataportal/statistics/getAwardDistribute"             //奖品分布
        var getPie1 = "/api/tztx/statistics/specifAwardDistribute"
          //现金/红包
        var getScanCon = "/api/tztx/statistics/specifScanTimesOfCity"
           //全国地市扫码烟包数
        var getProvinceAnalysis = "/api/tztx/statistics/specifMapData"
           //分省分析；
        var getDistrict = "api/tztx/statistics/specifAllProvScancode"
          //省内各地市扫码烟包数排名;
        var getCity = "/api/tztx/statistics/specifInterProvScancode"

        this.$hourchart = request.$Query(HOURS_JSON_URL);
        this.$peopletrend = request.$Query(PEOPLE_JSON_URL);
        this.$Default = request.$Query(DEFAULT_JSON_URL);
        this.$planchart = request.$Query(PLAN_JSON_URL);
        this.$citychart = request.$Query(CITY_JSON_URL);
        //this.$awardchart = request.$Query(AWARD_JSON_URL);
        this.$draw = request.$Query(DRAW_JSON_URL);
        this.$mapchart = request.$Query(MAP_JSON_URL);
        this.$chinaJson = request.$Query(CHINA_JSON_URL);
        this.$pie1chart = request.$Query(PIE1_JSON_URL);
        // this.$pie1chart = request.$Query(PIE1_JSON_URL);
        this.$fenbu = request.$Query(fenBu_JSON_URL);
        this.$scan = request.$Query(SCAN_JSON_URL);
        this.$mapConf = request.$Query(MAP_JSON_CONF);
        this.$districtConf = request.$Query(DISTRICT_CONF);
        this.$cityConf = request.$Query(CITY_CHART_CONF);
        this.$getBrand = function() {
          return request.$Search(getBrand,{},true);
        },
        this.$getProduct = function(params){
          return request.$Search(getProduct,params,true);
        }
        this.$getWeeks = function(){
          return request.$Search(getWeeks,{},true);
        }
        this.$specfication = function (params) {
          return request.$Search(specification,params,true);
        }
        this.$hourTrend = function(params){
          var option = _.cloneDeep(params);
          option.flag = 2;
          return request.$Search(hourTrend,option,true);
        }
        this.$peopleTrend = function(params){
          var option = _.cloneDeep(params);
          option.flag = 2;
          return request.$Search(peopleTrend,option,true);
        }
        this.$getMap = function (params) {
          return request.$Search(getMap,params,true);
        }
        this.$City = function (params) {
          return request.$Search(City,params,true);
        }
        this.$timesTrendOfSpec = function (params) {
          return request.$Search(timesTrendOfSpec,params,true);
        }
        this.$drawTimes = function (params) {
          return request.$Search(drawTimes,params,true);
        }
        this.$getMoney = function (params,flag) {
          var option = _.cloneDeep(params);
          if(flag){
            option.awardFlag = 2;
          }
          return request.$Search(getPie1,option,true);
        }
        this.$getThing = function (params,flag) {
          var option = _.cloneDeep(params);
          if(flag){
            option.awardFlag = 1;
          }
          return request.$Search(getPie1,option,true);
        }
        this.$getScan = function (params) {
          return request.$Search(getScanCon,params,true);
        }
        this.$getProvincialAnalysis = function(params) {
          return request.$Search(getProvinceAnalysis,params,true);
        }
        this.$getDistrictTrend = function(params) {
          return request.$Search(getDistrict,params,true);
        }
        this.$getCityTrend = function(params) {
          return request.$Search(getCity,params,true);
        }
      };
    }]
  };

  return specModel;
});