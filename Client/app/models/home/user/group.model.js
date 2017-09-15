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
          var getScanNumberUsers = '/api/tztx/dataportal/consumer/getScanNumberUsers'; //用户数
          var getTagName = '/api/tztx/dataportal/consumer/getTagName'; //用户数名称           





          this.$getTagName = function () {
            return request.$Search(getTagName,{},true);            
          }
          this.$getScanNumberUsers = function(params) {
            return request.$Search(getScanNumberUsers,params,true);
          }                   
        };
      }]
    };
  
    return groupModel;
  });