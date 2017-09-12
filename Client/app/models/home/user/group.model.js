/**
 * Author: jinlinyong
 * Create Date: 2017-09-12
 * Description: group
 */

define([], function () {
    var groupModel = {
      ServiceType: 'service',
      ServiceName: 'GroupViewModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {
            console.log("group is under Model")
        };
      }]
    };
  
    return groupModel;
  });