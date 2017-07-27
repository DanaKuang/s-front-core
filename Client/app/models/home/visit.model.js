/**
 * Author: {author}
 * Create Date: 2017-07-04
 * Description: visit
 */

define([], function () {
  var visitModel = {
    ServiceType: 'service',
    ServiceName: 'visitViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        
        
        var getFeed = '/api/tztx/dataportal/statistics/getFeedBack';  //回访记录
        var feedBack = '/api/tztx/dataportal/statistics/feedbackCount';  //回访数量
        var update = '/api/tztx/dataportal/statistics/updateFeddBackStatus';  //更新回访记录
        
        this.$getFeed = function (params) {
          return request.$Search(getFeed,params,true);
        }
        this.$feedBack = function (params) {
          return request.$Search(feedBack,params,true);
        }
        this.$update = function (params) {
          return request.$Search(update,params,true);
        }
      };
    }]
  };

  return visitModel;
});