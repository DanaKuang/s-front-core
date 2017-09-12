/**
 * Author: jinlinyong
 * Create Date: 2017-09-12
 * Description: group
 */

define([], function () {
    var GroupController = {
      ServiceType: 'controller',
      ServiceName: 'GroupCtrl',
      ViewModelName: 'GroupViewModel',
      ServiceContent: ['$scope', function ($scope) {
          console.log("group is under controller")
      }]
    };
  
    return GroupController;
  });