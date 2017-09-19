/**
 * Author: jinlinyong
 * Create Date: 2017-09-12
 * Description: group
 */

define([], function () {
    var groupModel = {
      ServiceType: 'service',
      ServiceName: 'GroupViewModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {
          var PIE_JSON_URL = '/statics/home/user/group/pie.json';                          //当月不同香烟类别扫码分布 
          var FREQUENCY_JSON_URL = '/statics/home/user/group/frequency.json';              //不同扫码频次用户分布   
          var DAYTREND_JSON_URL = '/statics/home/user/group/dayTrend.json';                //用户发展日趋势     
          var MONTHTREND_JSON_URL = '/statics/home/user/group/monthTrend.json';            //用户发展月趋势               
          

          var getScanNumberUsers = '/api/tztx/dataportal/consumer/getScanNumberUsers';      //用户数
          var getTagName = '/api/tztx/dataportal/consumer/getTagName';                      //用户数名称           
          var getSmokeTypePie = '/api/tztx/dataportal/consumer/getSmokeTypePie';            //不同类别香烟的分布饼图
          var getSmokeTypeTable = '/api/tztx/dataportal/consumer/getSmokeTypeTable';        //不同类别香烟的分布表格
          var getUserBrand = '/api/tztx/dataportal/public/getUserBrandByUserId';            //品牌
          var getProduct = '/api/tztx/dataportal/statistics/getProduct';                    //规格  
          var getThrMonScanSmokeBar = '/api/tztx/dataportal/consumer/getThrMonScanSmokeBar' //近三个月扫码总数              
          var getMonScanSmokeBar = '/api/tztx/dataportal/consumer/getMonScanSmokeBar'       //当月扫码烟包数
          var getDayTrendScan = '/api/tztx/dataportal/consumer/getDayTrendScanUserBar'      //用户发展日趋势
          var getMonthTrendScan = '/api/tztx/dataportal/consumer/getMonthTrendScanUserBar'  //用户发展月趋势
          var getMonthTopten = '/api/tztx/dataportal/consumer/getMonthToptenTable'          //当月扫码次数排名前十

          this.$pie = request.$Query(PIE_JSON_URL);
          this.$frequency = request.$Query(FREQUENCY_JSON_URL);
          this.$dayTrend = request.$Query(DAYTREND_JSON_URL);
          this.$monthTrend = request.$Query(MONTHTREND_JSON_URL);
          
          
          this.$getTagName = function () {
            return request.$Search(getTagName,{},true);            
          }
          this.$getScanNumberUsers = function(params) {
            return request.$Search(getScanNumberUsers,params,true);
          }
          this.$getSmokeTypePie = function (params) {
            return request.$Search(getSmokeTypePie,params,true);
          }
          this.$getSmokeTypeTable = function (params) {
            return request.$Search(getSmokeTypeTable,params,true);
          }
          this.$getUserBrand = request.$Search(getUserBrand,{},true)
          this.$getProduct = function (params) {
            return request.$Search(getProduct,params,true)
          }
          this.$getThrMonScanSmokeBar = function (params) {
            return request.$Search(getThrMonScanSmokeBar,params,true)            
          }
          this.$getMonScanSmokeBar = function (params) {
            return request.$Search(getMonScanSmokeBar,params,true)            
          }
          this.$getDayTrendScan = function(params) {
            return request.$Search(getDayTrendScan,params,true)
          }
          this.$getMonthTrendScan = function (params) {
            return request.$Search(getMonthTrendScan,params,true)
          }
          this.$getMonthTopten = function(params) {
            return request.$Search(getMonthTopten,params,true)
          }
        };
      }]
    };
  
    return groupModel;
  });