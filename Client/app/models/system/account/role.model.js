/**
 * Author: liubin
 * Create Date: 2017-10-16
 * Description: role
 */

define([], function () {
    var roleModel = {
        ServiceType: "service",
        ServiceName: "roleViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
                var POST_DATA_URL = "/api/tztx/saas/admin/sys/roleSaveOrUpdate";  // 新增，修改
                var STOP_DATA_URL = "/api/tztx/saas/admin/sys/roleSaveOrUpdate";  // 停用接口
                var GET_DETAIL_DATA = "/api/tztx/saas/admin/sys/roleDetail";      // 查询单条数据
                var GET_TABLE_URL = "/api/tztx/saas/admin/sys/roleList";          // 表格数据
                var GET_ROLE_LIST = "/api/tztx/saas/admin/sys/roleList";          // role列表

                // role列表
                this.$role = request.$Search(GET_ROLE_LIST, {
                    pageSize: -1
                }, true);
                // 提交数据
                this.postData = function (params) {
                    return request.$Search(POST_DATA_URL, params, true);
                };
                // 单条
                this.detail = function (params) {
                    return request.$Search(GET_DETAIL_DATA, params, true);
                };
                // 获取表格数据
                this.getTable = function (params) {
                    return request.$Search(GET_TABLE_URL, params, true);
                };
                // 停用
                this.stop = function (params) {
                    return request.$Search(STOP_DATA_URL, params, true);
                };
            };
        }]
    };
    return roleModel;
});