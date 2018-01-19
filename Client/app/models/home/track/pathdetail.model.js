/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: pathdetail
 */

define([], function () {
    var pathdetail = {
        ServiceType: 'service',
        ServiceName: 'pathdetailViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var GET_ACTIVITY_DATA = "/api/tztx/dataportal/actAnalysis/getActyDownBox";      // 获取活动名称
                var GET_BRAND_DATA = "/api/tztx/dataportal/public/getUserBrandByUserId";     // 获取品牌
                var GET_PRODUCT_DATA = "/api/tztx/dataportal/actAnalysis/getActyProductDownBox";// 获取规格

                var GET_PAGEIN_DATA = "/api/tztx/dataportal/actAnalysis/getSourcePageData";     // 获取页面流入数据
                var GET_PAGEOUT_DATA = "/api/tztx/dataportal/actAnalysis/getRedirectPageData";  // 获取页面流出数据
                var GET_PAGEEVENT_DATA = "/api/tztx/dataportal/actAnalysis/getEventData";       // 获取页面事件数据
                var GET_PAGEID_DATA = "/api/tztx/dataportal/actAnalysis/getPageByActivityId";   // 获取活动页面
                var GET_PRODUCT_BYSN = "/api/tztx/dataportal/public/getPorductDetailBySn"         //获取产品信息
                var GET_ACTIVITY_BYSN = "/api/tztx/dataportal/public/getActivityListBySn"         //获取活动信息
                var GET_AD_BYSN = "/api/tztx/dataportal/public/getADListBySn"         //获取活动信息

                // 获取活动下拉框
                this.$activity = request.$Search(GET_ACTIVITY_DATA, {}, true);

                // 获取活动页面
                this.getActPage = function (params) {
                    return request.$Search(GET_PAGEID_DATA, params, true);
                };
                // 获取品牌
                // this.$brand = request.$Search(GET_BRAND_DATA, {}, true);
                // 根据品牌获取规格
                // this.getProduct = function (params) {
                //     return request.$Search(GET_PRODUCT_DATA, params, true);
                // };
                // 获取页面流入
                this.getPageIn = function (params) {
                    return request.$Search(GET_PAGEIN_DATA, params, true);
                };
                // 获取页面流出数据
                this.getPageOut = function (params) {
                    return request.$Search(GET_PAGEOUT_DATA, params, true);
                };
                // 获取页面点击事件
                this.getPageEvent = function (params) {
                    return request.$Search(GET_PAGEEVENT_DATA, params, true);
                };
                this.getProductBySn = function(params) {
                    return request.$Search(GET_PRODUCT_BYSN,params,true);
                }
                this.getActivityBySn = function(params) {
                    return request.$Search(GET_ACTIVITY_BYSN,params,true);
                }
                this.getADBySn = function(params) {
                    return request.$Search(GET_AD_BYSN,params,true);
                }
            };
        }]
    };

    return pathdetail;
});