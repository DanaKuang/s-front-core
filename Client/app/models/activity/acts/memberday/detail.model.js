/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动详情
 */

define([], function () {
    var memberDayDetailModel = {
        ServiceType: 'service',
        ServiceName: 'mdDetailModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var GET_WEEK_DATA = "/api/tztx/dataportal/statistics/getWeeks";             // 周
                var GET_TABLE_DATA = "/api/tztx/saas/saotx/activity/queryMemberAwards";     // 表格数据
                var GET_DROPDOWN_DATA = "/api/tztx/saas/saotx/activity/queryMatypes";       // 下拉
                var GET_TIER_AREA = '/api/tztx/saas/saotx/common/queryTreeRegion';          // 地区
                var SEND_MESSAGE_DATA = '/api/tztx/saas/saotx/activity/sendMemberMessage';  // 发送消息
                var GET_SERVER_TIME = '/api/tztx/saas/saotx/activity/newSystemTime';        // 获取服务器时间

                // 服务器时间
                this.$sTime = request.$Search(GET_SERVER_TIME, {});
                // 周
                this.$week = request.$Search(GET_WEEK_DATA, {}, true);
                // 奖品类型
                this.$type = request.$Search(GET_DROPDOWN_DATA, {}, true);
                // 地区
                this.$area = request.$Search(GET_TIER_AREA, {}, true);
                // 表格数据
                this.getTableData = function (params) {
                    return request.$Search(GET_TABLE_DATA, params);
                };
                // 发送消息
                this.sendMsg = function (params) {
                    return request.$Search(SEND_MESSAGE_DATA, params);
                };
            };
        }]
    };
    return memberDayDetailModel;
});
