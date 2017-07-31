/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: report
 */

define([], function () {
  var reportModel = {
    ServiceType: 'service',
    ServiceName: 'reportViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        var winUser = '/api/tztx/dataportal/fixatreport/getWinUseProvData' //中奖用户地域
        var userPro = '/api/tztx/dataportal/fixatreport/getScanUseProvData' //扫码用户区域
        var summaryData = '/api/tztx/dataportal/fixatreport/getDailySummaryData' //日报
        var getProductNo = '/api/tztx/dataportal/statistics/getProductOfNoNuit'  //扫码规格
        var getProduct = '/api/tztx/dataportal/statistics/getProduct'  //扫码规格

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
      };
    }]
  };

  return reportModel;
});