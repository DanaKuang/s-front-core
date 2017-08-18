/**
 * Author: liubin
 * Create Date: 2017-08-06
 * Description: retailer
 */

define([], function () {
    var retailerModel = {
        ServiceType: 'service',
        ServiceName: 'retailerViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // 图表配置
                var GROW_MAP_CONF = "/statics/home/retailer/growMapConf.json";  //增长折线图
                var DIST_MAP_CONF = "/statics/home/retailer/distMapConf.json";  //业态分布图
                var DG_MAP_CONF = "/statics/home/retailer/dgMapConf.json";      // 业态分布增长折线图
                var LP_MAP_CONF = "/statics/home/retailer/lpMapConf.json";      //左侧饼图
                var RP_MAP_CONF = "/statics/home/retailer/rpMapConf.json";      //右侧饼图

                var GET_TOTAL_DATA = "/api/tztx/dataportal/shopKeeper/getShopTotalFamily";          // 累计零售户
                var GET_ACTIVITY_DATA = "/api/tztx/dataportal/shopKeeper/getShopActiyFamily";       // 参与活动零售户
                var GET_NEW_DATA = "/api/tztx/dataportal/shopKeeper/getShopNewFamily";              // 新增零售户
                var GET_GROWTH_DATA = "/api/tztx/dataportal/shopKeeper/getShopGrowthTrend";         // 零售户增长趋势
                var GET_PIE_DATA = "/api/tztx/dataportal/shopKeeper/getShopBizFormatPie";           // 零售户业态分布
                var GET_CITY_DROPDOWN = "/api/tztx/dataportal/shopKeeper/getShopDownBox";           // dropdownbox
                var GET_SHOP_DATA = "/api/tztx/dataportal/shopKeeper/getShopGrowthTrendById";       // 零售户店铺折线图
                var GET_SHOP_PROVINCE_DATA = "/api/tztx/dataportal/shopKeeper/getShopInoutProvPie"; // 省外分布
                var GET_SHOP_CITY_DATA = "/api/tztx/dataportal/shopKeeper/getShopInoutCityPie";     // 城乡分布

                // 图表配置
                this.$growMapConf = request.$Query(GROW_MAP_CONF);
                this.$distMapConf = request.$Query(DIST_MAP_CONF);
                this.$dgMapConf = request.$Query(DG_MAP_CONF);
                this.$lpMapConf = request.$Query(LP_MAP_CONF);
                this.$rpMapConf = request.$Query(RP_MAP_CONF);

                this.$dropShop = request.$Search(GET_CITY_DROPDOWN, {}, true);
                // 累计零售户
                this.getTotal = function (params) {
                    return request.$Search(GET_TOTAL_DATA, params, true);
                };
                // 参与活动零售户
                this.getActivity = function (params) {
                    return request.$Search(GET_ACTIVITY_DATA, params, true);
                };
                // 新增零售户
                this.getNew = function (params) {
                    return request.$Search(GET_NEW_DATA, params, true);
                };
                // 零售户增长趋势
                this.getGrowth = function (params) {
                    return request.$Search(GET_GROWTH_DATA, params, true);
                };
                // 零售户业态分布
                this.getPie = function (params) {
                    return request.$Search(GET_PIE_DATA, params, true);
                };
                // 零售户店铺折线图
                this.getShop = function (params) {
                    return request.$Search(GET_SHOP_DATA, params, true);
                };
                // 省外分布
                this.getShopPro = function (params) {
                    return request.$Search(GET_SHOP_PROVINCE_DATA, params, true);
                };
                // 城乡分布
                this.getShopCity = function (params) {
                    return request.$Search(GET_SHOP_CITY_DATA, params, true);
                };

            };
        }]
    };

    return retailerModel;
});