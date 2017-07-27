/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: realPrizeGotHistory
 */

define([], function () {
  var mPrizeGotHistoryModel = {
    ServiceType: 'service',
    ServiceName: 'mPrizeGotHistoryModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        console.log('mPrizeGotHistory model is under control.');
      };
    }]
  };
  return mPrizeGotHistoryModel;
});