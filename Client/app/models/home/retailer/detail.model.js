/**
 * Author: liubin
 * Create Date: 2017-08-06
 * Description: detail
 */

define([], function () {
    var detailModel = {
        ServiceType: 'service',
        ServiceName: 'detailViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var GET_CITY_DROPDOWN = "/api/tztx/dataportal/shopKeeper/getShopDownBox";       // dropdownbox
                var GET_TABLE_DATA = "/api/tztx/dataportal/shopKeeper/getRetailuserDetail";     // 表格数据
                var GET_BRAND_DATA = "/api/tztx/dataportal/actAnalysis/getBrandOfActivity";     // 获取品牌
                var GET_PRODUCT_DATA = "/api/tztx/dataportal/actAnalysis/getActyProductDownBox";// 获取规格
                var GET_SELLER_DATA = "/api/tztx/dataportal/shopKeeper/getSellerByNameDownbox"; // 获取零售户名称

                // 下拉
                this.$dropShop = request.$Search(GET_CITY_DROPDOWN, {}, true);
                // 获取品牌
                this.$brand = request.$Search(GET_BRAND_DATA, {}, true);

                // 根据品牌获取规格
                this.getProduct = function (params) {
                    return request.$Search(GET_PRODUCT_DATA, params, true);
                };
                // 获取零售户名称
                this.getSeller = function (params) {
                    return request.$Search(GET_SELLER_DATA, params, true);
                };
                // 表格数据
                this.getTableData = function (params) {
                    return request.$Search(GET_TABLE_DATA, params, true);
                };
            };
        }]
    };

    return detailModel;
});