/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: realtime
 */

define([], function () {
    var realtime = {
        ServiceType: 'service',
        ServiceName: 'realtimeViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var CHINA_JSON_URL = '/statics/home/kpi/china.json';                        // 地图JSON
                var MAP_JSON_CONF = '/statics/home/track/realtime/mapConf.json';            // 地图配置
                var AXIS_JSON_CONF = '/statics/home/track/realtime/axisConf.json';          // 图表配置
                var DEF_MAP_DATA = "/statics/home/track/realtime/defMap.json";              // 默认数据

                var GET_ACTIVITY_DATA = "/api/tztx/dataportal/actAnalysis/getActyDownBox";  // 获取活动名称
                var PVUV_JSON_DATA = '/api/tztx/dataportal/activity/getPvData';             // 活动PV,UV
                var MINPV_JSON_DATA = '/api/tztx/dataportal/activity/getPvDataOfMin';       // 活动按分钟获取PVUV
                var PROPV_JSON_DATA = '/api/tztx/dataportal/activity/getProvincePvData';    // 活动按省份获取PVUV
                var CITYPV_JSON_DATA = '/api/tztx/dataportal/activity/getCityPvData';       // 活动按城市获取PVUV
                var DETAIL_JSON_DATA = '/api/tztx/dataportal/activity/getDetailPvData';     // 活动详细PVUV

                // 接口数据
                this.$chinaJson = request.$Query(CHINA_JSON_URL);
                // 图表配置
                this.$axisConf = request.$Query(AXIS_JSON_CONF);
                // 地图配置
                this.$mapConf = request.$Query(MAP_JSON_CONF);
                // 获取活动页面
                this.$activity = request.$Search(GET_ACTIVITY_DATA, {}, true);
                // 地图默认数据
                this.$defMap = request.$Query(DEF_MAP_DATA);
                // 获取活动PVUV
                this.getActPv = function (params) {
                    return request.$Search(PVUV_JSON_DATA, params, true);
                };
                // 按分钟获取PVUV
                this.getMinPv = function (params) {
                    return request.$Search(MINPV_JSON_DATA, params, true);
                };
                // 按省份获取PVUV
                this.getProPv = function (params) {
                    return request.$Search(PROPV_JSON_DATA, params, true);
                };
                // 按城市获取PVUV
                this.getCityPv = function (params) {
                    return request.$Search(CITYPV_JSON_DATA, params, true);
                };
                // 获取详情数据
                this.getDetail = function (params) {
                    return request.$Search(DETAIL_JSON_DATA, params, true);
                };
            };
        }]
    };

    return realtime;
});