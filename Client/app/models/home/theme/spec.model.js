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
        var stattime = new Date().getFullYear()+"-"+(new Date().getMonth()+1)   +"-"+(new Date().getDate()-1);
        var Default =  {
          "productId":"SP-U2K9C926D7V6",
          "statTime":"2017-07-17",
          "statType":"month"
        };
        var awardDefault =  {
          "productId":"111",
          "statTime":"2017-07-17",
          "statType":"day",
          "awardFlag":2
        };
        var hourDefault =  {
          "provinceId":"111",
          "statTime":"2017-07-17",
          "statType":"month",
          "flag":2
        };

        
        var HOURS_JSON_URL = '/statics/home/spec/hourCharts.json';   //扫码次数时刻趋势
        var PLAN_JSON_URL = '/statics/home/spec/plan.json'           //扫码次数时间趋势
        var DEFAULT_JSON_URL = '/statics/home/region/planDefault.json';     //扫码次数时刻趋势折线图基本配置
        var CITY_JSON_URL = '/statics/home/spec/city.json'           //各地市扫码次数
        var AWARD_JSON_URL = '/statics/home/spec/award.json'         //抽奖次数时间趋势
        var MAP_JSON_URL = '/statics/home/spec/map.json'             //地图
        var CHINA_JSON_URL = '/statics/home/kpi/china.json';         // 地图JSON
        var DRAW_JSON_URL = '/statics/home/spec/draw.json';         // 奖品领取
        var PIE1_JSON_URL = '/statics/home/spec/pie1.json';         // 奖品分布
        var PIE2_JSON_URL = '/statics/home/spec/pie2.json';         // 奖品分布


        var getProduct = '/api/tztx/dataportal/statistics/getProduct';  //省份下拉列表
        var getWeeks = '/api/tztx/dataportal/statistics/getWeeks';  //周下拉列表
        var specification = "/api/tztx/dataportal/statistics/specificationKPI"  //新增扫码人数
        var hourTrend = '/api/tztx/dataportal/statistics/scanTimesHourTrend';  //时刻分析图
        var getMap = "/api/tztx/dataportal/statistics/getMapData"  //地图
        var City = "/api/tztx/dataportal/statistics/scanTimesOfCityAndSpec"  //地市
        var timesTrendOfSpec = "/api/tztx/dataportal/statistics/scanTimesTrendOfSpec" //扫码次数时间趋势
        var drawTimes = "/api/tztx/dataportal/statistics/drawTimesTrendOfSpec" //奖品领取
        var getAward = "/api/tztx/dataportal/statistics/getAwardDistribute" //奖品分布

        
        
        
        

        this.$hourchart = request.$Query(HOURS_JSON_URL);
        this.$Default = request.$Query(DEFAULT_JSON_URL);
        this.$planchart = request.$Query(PLAN_JSON_URL);
        this.$citychart = request.$Query(CITY_JSON_URL);
        this.$awardchart = request.$Query(AWARD_JSON_URL);
        this.$draw = request.$Query(DRAW_JSON_URL);
        this.$mapchart = request.$Query(MAP_JSON_URL);
        this.$chinaJson = request.$Query(CHINA_JSON_URL);
        this.$pie1chart = request.$Query(PIE1_JSON_URL);
        this.$pie2chart = request.$Query(PIE2_JSON_URL);

        this.$getProduct = function(){
          return request.$Search(getProduct,{},true);
        }
        this.$getWeeks = function(){
          return request.$Search(getWeeks,{},true);
        }
        this.$specfication = function (params) {
          var option = params || Default;
          console.log(option);
          return request.$Search(specification,option,true);
        }
        this.$hourTrend = function(params){
          var params = params || hourDefault;
          return request.$Search(hourTrend,params,true);
        }
        this.$getMap = function (params) {
          var option = params || Default;
          return request.$Search(getMap,option,true);
        }
        this.$City = function (params) {
          var option = params || Default;
          return request.$Search(City,option,true);
        }
        this.$timesTrendOfSpec = function (params) {
          var option = params || Default;
          return request.$Search(timesTrendOfSpec,option,true);
        }
        this.$drawTimes = function (params) {
          var option = params || Default;
          return request.$Search(drawTimes,option,true);
        }
        this.$money = function (params,flag) {
          var option = params || awardDefault;
          if(flag){
            option.awardFlag = 1;
          }
          return request.$Search(getAward,option,true);
        }
        this.$thing = function (params,flag) {
          var option = params || awardDefault;
          if(!flag){
            option.awardFlag = 2;
          }
          return request.$Search(getAward,option,true);
        }
      };
    }]
  };

  return specModel;
});