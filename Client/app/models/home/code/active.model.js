/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: multi
 */

define([], function () {
    var activeModel = {
        ServiceType: 'service',
        ServiceName: 'activeViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {

            // 查询
            var GET_CODE_LIST = "/api/tztx/saas/saotx/codeActivate/queryCode";   // 获取假码列表
            var ACT_CODE_DATA = "/api/tztx/saas/saotx/codeActivate/updateDate";  // 激活某一条记录

            // 获取假码表格数据
            this.getCodeList = function (params) {
                return request.$Search(GET_CODE_LIST, params);
            };

            // 激活
            this.actCode = function (params) {
                return request.$Search(ACT_CODE_DATA, params);
            };
        };
    }]
  };
  return activeModel;
});