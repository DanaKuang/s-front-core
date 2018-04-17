/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: user
 */
define([], function () {
    var userModel = {
        ServiceType: "service",
        ServiceName: "userViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
                var POST_DATA_URL = "";     // 新增，修改
                var STOP_DATA_URL = "";     // 停用接口
                var GET_TABLE_URL = "";     // 表格数据

                // 提交数据
                this.postData = function (params) {
                    request.$Query(POST_DATA_URL, params, true);
                };

                // 获取表格数据
                this.getTable = function (params) {
                    request.$Query(GET_TABLE_URL, params, true);
                };
                // 停用
                this.stop = function (params) {
                    request.$Query(STOP_DATA_URL, params, true);
                };
            };
        }]
    };
    return userModel;
});