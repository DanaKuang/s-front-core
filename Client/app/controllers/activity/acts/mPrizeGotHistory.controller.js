/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: realPrizeGotHistory
 */

define([], function () {
  var mPrizeGotHistoryController = {
    ServiceType: 'controller',
    ServiceName: 'mPrizeGotHistoryCtrl',
    ViewModelName: 'mPrizeGotHistoryModel',
    ServiceContent: ['$scope', function ($scope) {
      console.log('mPrizeGotHistory controller is under control.');
    }]
  };

  return mPrizeGotHistoryController;
});