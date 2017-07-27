/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: virtualPrizeGotHistory
 */

define([], function () {
  var vPrizeGotHistoryModel = {
    ServiceType: 'service',
    ServiceName: 'vPrizeGotHistoryModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        console.log('vPrizeGotHistory model is under control.');
      };
    }]
  };
  return vPrizeGotHistoryModel;
});