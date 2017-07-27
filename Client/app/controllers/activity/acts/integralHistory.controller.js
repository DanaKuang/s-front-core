/**
 * Author: kuang
 * Create Date: 2017-07-20
 * Description: integralHistory
 */

define([], function () {
  var integralHistoryController = {
    ServiceType: 'controller',
    ServiceName: 'integralHistoryCtrl',
    ViewModelName: 'integralHistoryModel',
    ServiceContent: ['$scope', function ($scope) {
      console.log('integralHistory controller is under control.');
    }]
  };

  return integralHistoryController;
});