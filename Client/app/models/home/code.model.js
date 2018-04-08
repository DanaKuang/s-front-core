/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: multi
 */

define([], function () {
    var codeModel = {
        ServiceType: 'service',
        ServiceName: 'codeViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {

            // 查询
            var GET_BRAND_DATA = "/api/tztx/dataportal/public/getUserBrandByUserId";    // 获取品牌
            var GET_PRODUCT_DATA = "/api/tztx/dataportal/statistics/getProductOfNoNuit";// 获取规格
            var GET_CITY_DATA = "/api/tztx/dataportal/statistics/getCitysByProvince";   // 获取市
            var GET_PROVINCE_DATA = "/api/tztx/dataportal/public/getUserProvByUserId";  // 获取省
            var GET_SALE_ZONE = "/api/tztx/dataportal/public/getUserSaleByUserId";      //销区

            this.$modals = request.$Query(GET_BRAND_DATA);

            // 指标表格
            this.getTarget = function (params) {
                return request.$Search(GET_SALE_ZONE, params, true);
            };
        };
    }]
  };
  return codeModel;
});