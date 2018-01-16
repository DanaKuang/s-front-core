/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDaySettingModel = {
        ServiceType: 'service',
        ServiceName: 'mdSettingModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var GET_BRAND_DATA = "/api/tztx/saas/saotx/common/queryBrandWithRight";         // 获取品牌
                var GET_PRODUCT_DATA = "/api/tztx/saas/saotx/common/queryProduct";              // 获取规格
                var GET_CITY_DATA = "/api/tztx/saas/saotx/common/queryRegionByParentCode";      // 获取市
                var GET_PROVINCE_DATA = "/api/tztx/saas/saotx/common/queryRegionByParentCode";  // 获取省
                var UPDATE_DATA = "/api/tztx/saas/saotx/activity/saveOrUpdate";                 // 更新数据
                var EDIT_URL_DATA = "/api/tztx/saas/saotx/activity/activityDetail";             // 编辑信息
                var UPLOAD_FILE_ALY = '/api/tztx/saas/saotx/attach/commonAliUpload';            // 文件上传
                var GET_DETAIL_DATA = '/api/tztx/saas/saotx/activity/queryMemberAct';            // 详情接口

                // 获取品牌
                this.$brand = request.$Search(GET_BRAND_DATA, {}, true);
                // 获取省
                this.$province = request.$Search(GET_PROVINCE_DATA, {}, true);
                // 详情
                this.$detail = request.$Search(GET_DETAIL_DATA, {
                    actForm: 'act-12'
                });
                // 根据品牌获取规格
                this.getProduct = function (params) {
                    return request.$Search(GET_PRODUCT_DATA, params);
                };
                // 根据省获取市
                this.getCity = function (params) {
                  return request.$Search(GET_CITY_DATA, params);
                };
                // 保存更新
                this.update = function (params) {
                    return request.$Search(UPDATE_DATA, params, true);
                };
                // 编辑
                this.edit = function (params) {
                    return request.$Search(EDIT_URL_DATA, params);
                };
                // 文件上传
                this.upload = function (data) {
                    return $.ajax({
                        url: UPLOAD_FILE_ALY,
                        type: 'POST',
                        cache: false,
                        data: data,
                        processData: false,
                        contentType: false,
                        headers: {
                            ContentType: "multipart/form-data",
                            loginId : sessionStorage.access_loginId,
                            token : sessionStorage.access_token
                        }
                    })
                };
            };
        }]
    };
  return memberDaySettingModel;
});
