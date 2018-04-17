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
                var GET_TABLE_URL = "";     // 表格数据

                // 获取表格数据
                this.getTableList = function (params) {
                    request.$Query(GET_TABLE_URL, params, true);
                };
            };
        }]
    };
    return logsModel;
});
