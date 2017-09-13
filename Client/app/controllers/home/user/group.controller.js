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
      ServiceContent: ['$scope','setDateConf', function ($scope,setDateConf) {
        setDateConf.init($(".group-month"), 'month');        
      }]
    };
  
    return GroupController;
  });