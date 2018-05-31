/**
 * Author: kuang
 * Create Date: 2017-07-20
 * Description: integralHistory
 */

define([], function () {
  var integralHistoryModel = {
    ServiceType: 'service',
    ServiceName: 'integralHistoryModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
      };
    }]
  };
  return integralHistoryModel;
});