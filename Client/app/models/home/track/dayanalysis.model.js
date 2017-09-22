/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: dayanalysis
 */

define([], function () {
    var dayanalysis = {
        ServiceType: 'service',
        ServiceName: 'dayanalysisViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var CHINA_JSON_URL = '/statics/home/kpi/china.json';                        // 地图JSON
                var DAYMAP_JSON_CONF = '/statics/home/track/dayanalysis/dayMapConf.json';   // 图表配置
                var MAP_JSON_CONF = '/statics/home/track/dayanalysis/mapConf.json';         // 地图配置
                var CITYMAP_JSON_CONF = '/statics/home/track/dayanalysis/cityMapConf.json'; // 城市配置
                var PIE_JSON_CONF = "/statics/home/track/dayanalysis/pieConf.json";         // 饼图配置
                var DEF_MAP_DATA = "/statics/home/track/dayanalysis/defMap.json";          // 默认数据

                var GET_ACTIVITY_DATA = "/api/tztx/dataportal/actAnalysis/getActyDownBox";      // 获取活动名称
                var GET_BRAND_DATA = "/api/tztx/dataportal/public/getUserBrandByUserId";     // 获取品牌
                var GET_PRODUCT_DATA = "/api/tztx/dataportal/actAnalysis/getActyProductDownBox";// 获取规格

                var GET_TREND_DATA = "/api/tztx/dataportal/actAnalysis/getTrendData";           // 获取趋势分析
                var GET_MAP_DATA = "/api/tztx/dataportal/actAnalysis/getProvinceData";          // 获取地域分析
                var GET_CITY_DATA = "/api/tztx/dataportal/actAnalysis/getCityData";             // 获取城市数据
                var GET_PIE_DATA = "/api/tztx/dataportal/actAnalysis/getTerminalData";          // 获取终端数据
                var GET_PROVINCE_CITY = "/api/tztx/dataportal/statistics/getCitysByProvince";   // 根据省获取市
                var GET_PAGE_TRANS_DATA = "/api/tztx/dataportal/actAnalysis/getPagePathByActivityId"; // 页面流失统计

                this.$chinaJson = request.$Query(CHINA_JSON_URL);
                this.$defMap = request.$Query(DEF_MAP_DATA);
                // 地图、折线图配置、饼图
                this.$dayMapConf = request.$Query(DAYMAP_JSON_CONF);          // 日常折线图
                this.$cityMapConf = request.$Query(CITYMAP_JSON_CONF);        // 城市折线图
                this.$mapConf = request.$Query(MAP_JSON_CONF);                // 地域分析
                this.$pieLeftConf = request.$Query(PIE_JSON_CONF);            // 左侧饼图配置
                this.$pieRightConf = request.$Query(PIE_JSON_CONF);           // 右侧饼图配置
                this.$activity = request.$Search(GET_ACTIVITY_DATA, {}, true);// 获取活动下拉框

                // 获取品牌
                this.$brand = request.$Search(GET_BRAND_DATA, {}, true);
                // 根据品牌获取规格
                this.getProduct = function (params) {
                    return request.$Search(GET_PRODUCT_DATA, params, true);
                };
                // 获取日常折线图数据
                this.getDayMap = function (params) {
                    return request.$Search(GET_TREND_DATA, params, true);
                };
                // 获取地域分析地图数据
                this.getMapData = function (params) {
                    return request.$Search(GET_MAP_DATA, params, true);
                };
                this.getCityName = function (params) {
                    return request.$Search(GET_PROVINCE_CITY, params, true);
                };
                // 获取城市折线图数据
                this.getCityMap = function (params) {
                    return request.$Search(GET_CITY_DATA, params, true);
                };
                // 获取饼图数据
                this.getPieData = function (params) {
                    return request.$Search(GET_PIE_DATA, params, true);
                };
                // 获取页面呢流失统计
                this.getPageData = function (params) {
                    return request.$Search(GET_PAGE_TRANS_DATA, params, true)
                };
            };
        }]
    };

  return dayanalysis;
});