/**
 * Author: chenliang
 * Create Date: 2017-12-05
 * Description: retailer
 */

define([], function () {
    var analysisModel = {
        ServiceType: 'service',
        ServiceName: 'analysisViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // 图表配置
                var CAL_MAP_CONF = "/statics/home/retailer/caLMapConf.json";  //业态分布玫瑰图               
                var CAR_MAP_CONF = "/statics/home/retailer/caRMapConf.json";  //业态分布柱状图    
                var TT_MAP_CONF = "/statics/home/retailer/ttMapConf.json";  //地域分布柱状图    
                var TimeT_MAP_CONF = "/statics/home/retailer/timeTMapConf.json";  //发展时间趋势折线图   
                
                var GET_PROVBYORGID_DATA = "/api/tztx/dataportal/public/getDefaultProvByorgId"  // 用户默认省份
                var GET_SHOPDOWNBOX_DATA = "/api/tztx/dataportal/shopKeeper/getShopDownBoxAll"  // 业态下拉框
                var GET_USERPROV_DATA = "/api/tztx/dataportal/public/getUserProvByUserIdS"  // 省份
                var GET_CITY_DATA = "/api/tztx/dataportal/shopKeeper/getCityClassDownBox"  // 地市等级
                var GET_CITYDOWN_DATA = "/api/tztx/dataportal/shopKeeper/getCityDownBox"  // 地市
                var GET_VSCITY_DATA = "/api/tztx/dataportal/shopKeeper/getVSCityClassDownBox"  // 对比地市等级
                var GET_VSCITYDOWNBOX_DATA = "/api/tztx/dataportal/shopKeeper/getVSCityDownBox"  // 对比地市
                var GET_ZEROBIZL_DATA = "/api/tztx/dataportal/shopKeeper/getZeroBizDistributePie"  // 零售户业态发布-玫瑰图
                var GET_ZEROBIZR_DATA = "/api/tztx/dataportal/shopKeeper/getZeroBizDistributeBar"  // 零售户业态发布-柱状图
                var GET_ZEROBIZREGIONALBAR_DATA = "/api/tztx/dataportal/shopKeeper/getZeroBizRegionalBar"  // 零售户地域分布-无对比
                var GET_VSZEROBIZREGIONALBAR_DATA = "/api/tztx/dataportal/shopKeeper/getVSZeroBizRegionalBar"  // 零售户地域分布-对比
                var GET_ZEROBIZTIMELINE_DATA = "/api/tztx/dataportal/shopKeeper/getZeroBizTimeline"  // 零售户发展时间趋势-无对比
                var GET_VSZEROBIZTIMELINE_DATA = "/api/tztx/dataportal/shopKeeper/getVSZeroBizTimeline"  // 零售户发展时间趋势-对比
                var GET_ZEROSHOPKPISELECTABLE_DATA = "/api/tztx/dataportal/shopKeeper/getZeroShopkpiSelectTable"  // 零售户关键指标查询
                var GET_WEEK_DATA = "/api/tztx/dataportal/statistics/getWeeks"      // 周
                // 图表配置
                this.$caLMapConf = request.$Query(CAL_MAP_CONF);                
                this.$caRMapConf = request.$Query(CAR_MAP_CONF);                
                this.$ttMapConf = request.$Query(TT_MAP_CONF);                
                this.$timeTMapConf = request.$Query(TimeT_MAP_CONF);                

                this.$ProvByorgId = request.$Search(GET_PROVBYORGID_DATA, {}, true); // 用户默认省份
                this.$ShopDownBox = request.$Search(GET_SHOPDOWNBOX_DATA, {}, true); // 业态下拉框
                this.$UserProv = request.$Search(GET_USERPROV_DATA, {}, true);      // 省份
                this.$week = request.$Search(GET_WEEK_DATA, {}, true);                     
                this.City = function (params) {
                    return request.$Search(GET_CITY_DATA, params, true);        // 地市等级
                };
                this.CityDown = function (params) {
                    return request.$Search(GET_CITYDOWN_DATA, params, true);    // 地市
                };
                this.VsCity = function (params) {
                    return request.$Search(GET_VSCITY_DATA, params, true);      // 对比地市等级
                };
                this.VsCityDownBox = function (params) {
                    return request.$Search(GET_VSCITYDOWNBOX_DATA, params, true);// 对比地市
                };

                // 零售户业态发布-玫瑰图
                this.ZeroBizL = function (params) {
                    return request.$Search(GET_ZEROBIZL_DATA, params, true);
                }
                 // 零售户业态发布-柱状图
                 this.ZeroBizR = function (params) {
                    return request.$Search(GET_ZEROBIZR_DATA, params, true);
                }
                // 零售户地域分布-无对比
                this.ZeroBizRegionalBar = function (params) {
                    return request.$Search(GET_ZEROBIZREGIONALBAR_DATA, params, true);
                }
                // 零售户地域分布-对比
                this.VSZeroBizRegionalBar = function (params) {
                    return request.$Search(GET_VSZEROBIZREGIONALBAR_DATA, params, true);
                }
                 // 零售户发展时间趋势-无对比
                 this.ZeroBizTimeline = function (params) {
                    return request.$Search(GET_ZEROBIZTIMELINE_DATA, params, true);
                }
                 // 零售户发展时间趋势-对比
                 this.VSZeroBizTimeline = function (params) {
                    return request.$Search(GET_VSZEROBIZTIMELINE_DATA, params, true);
                }
                // 零售户关键指标查询
                this.ZeroShopkpiSelectTable = function (params) {
                    return request.$Search(GET_ZEROSHOPKPISELECTABLE_DATA, params, true);
                }
            };
        }]
    };

    return analysisModel;
});