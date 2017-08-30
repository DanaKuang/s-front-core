/**
 * Author: {author}
 * Create Date: 2017-07-04
 * Description: agree
 */

define([], function () {
  var agreeModel = {
    ServiceType: 'service',
    ServiceName: 'agreeViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        
        //请求的接口地址
        var getOtherResouce = "api/tztx/dataportal/statistics/getOtherResouce"; // 异业
        var getPrize = "/api/tztx/dataportal/statistics/getPrize"; // 现金奖品分发
        var getBrand = "/api/tztx/dataportal/statistics/getBrand"; // 品牌接口
        var otherCount = "api/tztx/dataportal/statistics/getOtherResouceCount"; // 异业分页
        var prizeCount = "/api/tztx/dataportal/statistics/getPrizeCount"; // 奖品分页
        var getProduct = '/api/tztx/dataportal/statistics/getProduct';  //规格 
        var getAwardType = '/api/tztx/dataportal/statistics/getAwardType'; //奖品类别 
        var getPerformAppointCount = '/api/tztx/dataportal/statistics/getPerformAppointCount'; //履约数量       
        var getPerformAppoint = '/api/tztx/dataportal/statistics/getPerformAppoint'; //履约数量               
        

        this.$others = function(params) {
          return request.$Search(getOtherResouce,params,true);
        } ,
        this.$getPrize = function(params) {
          return request.$Search(getPrize,params,true);
        },
        this.$getBrand = function() {
          return request.$Search(getBrand,{},true);
        },
        this.$othersCount = function(params) {
          return request.$Search(otherCount,params,true);
        }
        this.$prizeCount = function(params) {
          return request.$Search(prizeCount,params,true);
        }
        this.$getProduct = function(params){
          return request.$Search(getProduct,params,true);
        }
        this.$getAwardType = function(){
          return request.$Search(getAwardType,{},true);
        }
        this.$getPerformAppointCount = function(params){
          return request.$Search(getPerformAppointCount,params,true);
        }
        this.$getPerformAppoint = function(params){
          return request.$Search(getPerformAppoint,params,true);
        }
      };
    }]
  };

  return agreeModel;
});