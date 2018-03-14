/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function () {
    var hbReportModel = {
      ServiceType: 'service',
      ServiceName: 'hbReportViewModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {
          var winUser = '/api/tztx/dataportal/fixatreport/getWinUseProvData' //中奖用户地域
          var userPro = '/api/tztx/dataportal/fixatreport/getScanUseProvData' //扫码用户区域
          var summaryData = '/api/tztx/dataportal/fixatreport/getDailySummaryData' //日报
          var getProductNo = '/api/tztx/dataportal/statistics/getProductOfNoNuit'  //扫码规格
          var getProduct = '/api/tztx/dataportal/statistics/getProduct'  //扫码规格
          var getWeeksDtatUrl = '/api/tztx/dataportal/statistics/getWeeks'; //获取每周时间数据


          var getBrandUrl = '/api/tztx/dataportal/fixatreport/getProductBrandDown'; //河北获取品牌
         
          var getSpeciftUrl = '/api/tztx/dataportal/fixatreport/getProductSnDown'; //河北根据品牌获取规格

          var getPackAndTimeUrl = '/api/tztx/dataportal/consumer/getTagName'; //获取包装及周期
          var getWeekScanUrl = '/api/tztx/dataportal/fixatreport/rptScanNumDateWeek'; //河北周报扫码次数和包数接口
          var getMonthScanUrl = '/api/tztx/dataportal/fixatreport/rptScanNumDateMonth';//河北周报扫码次数和包数接口
          var getWeekRedWinUrl = '/api/tztx/dataportal/fixatreport/rptScanRedDateWeek'; //河北周报—现金红包中奖情况统计
          var getWeekEntityWinUrl = '/api/tztx/dataportal/fixatreport/getWeekEntityWinData'; //周报—现金红包中奖情况统计
          var getProvDataUrl = '/api/tztx/dataportal/fixatreport/rptScanNumDateWeek'; //周报_扫码数据分省统计

          var getMonthRedWinUrl = '/api/tztx/dataportal/fixatreport/rptScanRedDateMonth'; //河北月报—现金红包中奖情况统计
          var getWeekRedWinUrl = '/api/tztx/dataportal/fixatreport/rptScanRedDateWeek'; //河北周报—现金红包中奖情况统计
          var getWeekEntityWinUrl = '/api/tztx/dataportal/fixatreport/getWeekEntityWinData'; //周报—现金红包中奖情况统计
          var getProvDataUrl = '/api/tztx/dataportal/fixatreport/rptScanNumDateWeek'; //周报_扫码数据分省统计
  
          this.$winUser = function (params) {
            return request.$Search(winUser,params,true);
          }
          this.$userPro = function (params) {
            return request.$Search(userPro,params,true);
          }
          this.$summaryData = function (params) {
            return request.$Search(summaryData,params,true);
          }
          this.$getProductNo = function () {
            return request.$Search(getProductNo,{},true);
          }
          this.$getProduct = function () {
            return request.$Search(getProduct,{},true);
          }
          this.$getWeeksData = function(){
            return request.$Search(getWeeksDtatUrl,{},true);
          }
          this.$getBrandData = function(){
            return request.$Search(getBrandUrl,{},true);
          }
          this.$getSpecifData = function(params){
            return request.$Search(getSpeciftUrl, params,true);
          }
          this.$getPackAndTimeData = function(params){
            return request.$Search(getPackAndTimeUrl,params,true);
          }
          this.$getWeekScanData = function(params){
            return request.$Search(getWeekScanUrl,params,true);
          }
          this.$getMonthScanData = function(params){
            return request.$Search(getMonthScanUrl,params,true);
          }
          this.$getWeekRedWinData = function(params){
            return request.$Search(getWeekRedWinUrl,params,true);
          }
          this.$getMonthRedWinData = function(params){
            return request.$Search(getMonthRedWinUrl,params,true);
          }
          this.$getWeekRedWinData = function(params){
            return request.$Search(getWeekRedWinUrl,params,true);
          }
          this.$getWeekEntityWinData = function(params){
            return request.$Search(getWeekEntityWinUrl,params,true);
          }
          this.$getProvData = function(params){
            return request.$Search(getProvDataUrl,params,true);
          }
        };
      }]
    };
  
    return hbReportModel;
  });