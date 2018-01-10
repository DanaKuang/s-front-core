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
                var GET_WEEK_DATA = "/api/tztx/dataportal/statistics/getWeeks";                 // 周
                var GET_BRAND_DATA = "/api/tztx/dataportal/public/getUserBrandByUserId";        // 获取品牌
                var GET_PRODUCT_DATA = "/api/tztx/dataportal/actAnalysis/getActyProductDownBox";// 获取规格
                var GET_TABLE_DATA = "/api/tztx/saas/saotx/order/queryOrderList";               // 表格数据

                // 周
                this.$week = request.$Search(GET_WEEK_DATA, {}, true);
                // 获取品牌
                this.$brand = request.$Search(GET_BRAND_DATA, {}, true);
                // 根据品牌获取规格
                this.getProduct = function (params) {
                    return request.$Search(GET_PRODUCT_DATA, params, true);
                };
                // 表格数据
                this.getTableData = function (params) {
                    return request.$Search(GET_TABLE_DATA, params, true);
                };
            };
        }]
    };
    return memberDayDetailModel;
});
