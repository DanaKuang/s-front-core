/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function () {
  var formarReportModel = {
    ServiceType: 'service',
    ServiceName: 'formarReportViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
      	var winUser = '/api/tztx/dataportal/henanreport/getProvReportData'  //数据分省统计日报
      	var getZhongGift = '/api/tztx/dataportal/actAnalysis/getActyDownBox'  //活动下拉菜单
        var getProduct = '/api/tztx/dataportal/statistics/getProduct'  //扫码规格
        var getBrandUrl = '/api/tztx/dataportal/public/getUserBrandByUserId'; //获取品牌
        var getUserPro = '/api/tztx/dataportal/henanreport/getActReportData'; //河南活动中奖统计日报
		var getsummaryData = '/api/tztx/dataportal/henanreport/getRedPacketReportData'; //河南现金红包中奖统计日报
		var getWeekScanWinUrl = '/api/tztx/dataportal/henanreport/getObjectReportData'; //实物奖品中奖统计日报
		var getProvDataUrl = '/api/tztx/dataportal/henanreport/getIntegralDarwReportData '; //河南积分操作情况统计日报
		var getWeekCashWinData = '/api/tztx/dataportal/henanreport/getIntegralListReportData'; //积分兑换明细日报
		var getProviceName = '/api/tztx/dataportal/public/getUserProvByUserId'; //获取省份名称
		var getSpeciftByBrand = '/api/tztx/dataportal/statistics/getCitysByProvince'; //获取地市名称
		
		
		        

        this.$winUser = function (params) {
          return request.$Search(winUser,params,true);
        }
        this.$getUserPro = function (params) {
          return request.$Search(getUserPro,params,true);
        }
        this.$summaryData = function (params) {
          return request.$Search(summaryData,params,true);
        }
        this.$getZhongGift = function () {
          return request.$Search(getZhongGift,{},true);
        }
        this.$getProduct = function (params) {
          return request.$Search(getProduct,params,true);
        }
        this.$getWeeksData = function(){
          return request.$Search(getWeeksDtatUrl,{},true);
        }
        this.$getBrandData = function(){
          return request.$Search(getBrandUrl,{},true);
        }
        this.$getSpecifData = function(params){
          return request.$Search(getProduct,params,true);
        }
        this.$getsummaryData = function(params){
          return request.$Search(getsummaryData,params,true);
        }
        this.$getPackAndTimeData = function(params){
          return request.$Search(getPackAndTimeUrl,params,true);
        }
        this.$getWeekScanWinData = function(params){
          return request.$Search(getWeekScanWinUrl,params,true);
        }
        this.$getWeekEntityWinData = function(params){
          return request.$Search(getWeekEntityWinUrl,params,true);
        }
        this.$getProvData = function(params){
          return request.$Search(getProvDataUrl,params,true);
        }
        this.$getWeekCashWinData = function(params){
          return request.$Search(getWeekCashWinData,params,true);
        }
        this.$getProviceName = function(){
          return request.$Search(getProviceName,{},true);
        }
        this.$getSpeciftByBrand = function(){
          return request.$Search(getSpeciftByBrand,{},true);
        }
      };
    }]
  };

  return formarReportModel;
});