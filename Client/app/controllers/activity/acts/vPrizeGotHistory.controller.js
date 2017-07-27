/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: virtualPrizeGotHistory
 */

define([], function () {
  var vPrizeGotHistoryController = {
    ServiceType: 'controller',
    ServiceName: 'vPrizeGotHistoryCtrl',
    ViewModelName: 'vPrizeGotHistoryModel',
    ServiceContent: ['$scope', function ($scope) {
      console.log('vPrizeGotHistory controller is under control.');
    }]
  };

  return vPrizeGotHistoryController;
});