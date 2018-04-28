/**
 * Author: liubin
 * Create Date: 2018-04-16
 * Description: role
 */
define([], function () {
    var logsModel = {
        ServiceType: "service",
        ServiceName: "logsViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
                var GET_TABLE_URL = "/api/tztx/saas/saotx/logger/list";         // 表格数据
                var GET_TYPE_DATA = "/api/tztx/saas/saotx/logger/types";        // 类型
                var GET_ORG_DATA = "/api/tztx/saas/admin/sys/queryListAllOrg"   // 公司列表

                // 类型
                this.$type = request.$Search(GET_TYPE_DATA, {}, true);

                // 公司
                this.$org = request.$Search(GET_ORG_DATA, {}, true);

                // 获取表格数据
                this.getTableList = function (params) {
                    return request.$Search(GET_TABLE_URL, params, true);
                };
            };
        }]
    };
    return logsModel;
});
