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
          var PIE_JSON_URL = '/statics/home/user/group/pie.json';         //当月不同香烟类别扫码分布          

          var getScanNumberUsers = '/api/tztx/dataportal/consumer/getScanNumberUsers';     //用户数
          var getTagName = '/api/tztx/dataportal/consumer/getTagName';     //用户数名称           
          var getSmokeTypePie = '/api/tztx/dataportal/consumer/getSmokeTypePie'    //不同类别香烟的分布饼图



          this.$pie = request.$Query(PIE_JSON_URL);
          
          this.$getTagName = function () {
            return request.$Search(getTagName,{},true);            
          }
          this.$getScanNumberUsers = function(params) {
            return request.$Search(getScanNumberUsers,params,true);
          }
          this.$getSmokeTypePie = function (params) {
            return request.$Search(getSmokeTypePie,params,true);
          }          
        };
      }]
    };
  
    return groupModel;
  });