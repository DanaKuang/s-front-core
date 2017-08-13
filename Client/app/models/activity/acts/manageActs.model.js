/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: manageActs
 */

define([], function () {
    var manageActsModel = {
        ServiceType: 'service',
        ServiceName: 'manageActsModel',
        ServiceContent: ['request', function (request) {
            // console.log(this); 
            //是个对象 manageActsModel.ServiceContent {}
            // console.log(manageActsModel.ServiceContent) 
            //是个数组  ["request", function]
            // console.log(this === manageActsModel.ServiceContent) 
            //false，其实可以认为是相等，但是angular做了转换

            //定义资源
            var $model = this;
            // 模板列表
            var GET_ACT_SAMPLE_LIST = '/api/tztx/saas/saotx/common/queryDimActivatyForm';
            // 活动列表
            var GET_ACTIVITY_LIST = '/api/tztx/saas/saotx/activity/list';
            // 活动状态
            var GET_ACTIVITY_STATUS = '/api/tztx/saas/saotx/activity/queryDimDataStatus';

            // 所有品牌
            var GET_ALL_BRANDS = '/api/tztx/saas/saotx/brand/queryBrands';
            // 模板列表对应的配置弹窗
            var GET_TEMPLATE_SPECIFIC = '/api/tztx/saas/saotx/template/template_common_list';
            // 供应商
            var GET_SUPPLIER_COMPANY = '/api/tztx/saas/saotx/common/querySupplier';
            // 根据供应商选择品牌
            var GET_BRAND_LIST = '/api/tztx/saas/saotx/common/queryBrand'
            // 根据品牌选择规格
            var GET_PRODUCT_LIST = '/api/tztx/saas/saotx/common/queryProduct';
            // 地区
            var GET_TIER_AREA = '/api/tztx/saas/saotx/common/queryRegionByParentCode';

            // 礼品、红包选择模板
            var GET_PRODUCT_CHOOSE_LIST = '/api/tztx/saas/saotx/product/queryMetraList';

            // 礼品增库
            var ADD_GIFT_STOCK = '/api/tztx/saas/saotx/poolGift/addPool';

            // 红包增库
            var ADD_HB_STOCK = '/api/tztx/saas/saotx/poolRedpack/addPool';

            // 文件上传到阿里云服务器,并且是让外网可以看到的附件
            var UPLOAD_FILE_ALY = '/api/tztx/saas/saotx/attach/commonAliUpload';

            // 文件上传到阿里云服务器,不需要外网看到
            var UPLOAD_FILE_ALY_PRIVATE = '/api/tztx/saas/saotx/attach/commonUploadFiles';

            // 新增活动
            var ADD_NEW_ACTIVITY = '/api/tztx/saas/saotx/activity/update';

            // 更改活动状态
            var CHANGE_ACTIVITY_STATUS = '/api/tztx/saas/saotx/activity/modifyStatus';

            // 编辑活动
            var EDIT_ACTIVITY = '/api/tztx/saas/saotx/activity/detail';

            // 模板列表
            $model.getActSampleList = function () {
                return request.$Search(GET_ACT_SAMPLE_LIST)
            }

            // 活动状态
            $model.getActivityStatus = function () {
                return request.$Search(GET_ACTIVITY_STATUS)
            }

            // 活动列表、页码
            $model.getActivityList = function (data) {
                return request.$Search(GET_ACTIVITY_LIST, data)
            }

            // 所有品牌
            $model.getAllBrands = function () {
                return request.$Search(GET_ALL_BRANDS);
            }

            // 获取模板对应的配置页面
            $model.getTemplateSpecific = function (data) {
                return request.$Search(GET_TEMPLATE_SPECIFIC, data)
            }

            // 获取厂家
            $model.getSupplierCompany = function () {
                return request.$Search(GET_SUPPLIER_COMPANY)
            }

            // 根据供应商，获取品牌
            $model.getBrandList = function (data) {
                return request.$Search(GET_BRAND_LIST, data)
            }

            // 根据品牌，获取规格
            $model.getProductList = function (data) {
                return request.$Search(GET_PRODUCT_LIST, data)
            }

            // 获取地区
            $model.getTierArea = function (data) {
                return request.$Search(GET_TIER_AREA, data);
            }

            // 礼品/红包选择列表
            $model.getProductChooseList = function (data) {
                return request.$Search(GET_PRODUCT_CHOOSE_LIST, data);
            }

            // 文件上传
            $model.uploadfiletoaly = function (data) {
                return request.$Search(UPLOAD_FILE_ALY, data, {
                    'ContentType': 'multipart/form-data'
                });
            }

            // 礼品增库
            $model.addgiftstock = function (data) {
                return request.$Search(ADD_GIFT_STOCK, data)
            }

            // 红包增库
            $model.addhbstock = function (data) {
                return request.$Search(ADD_HB_STOCK, data);
            }

            // 新增活动
            $model.addNewActivity = function (data) {
                return request.$Search(ADD_NEW_ACTIVITY, data)
            }

            // 更改活动状态
            $model.changeActivityStatus = function (data) {
                return request.$Search(CHANGE_ACTIVITY_STATUS, data);
            }

            // 编辑活动
            $model.editActivity = function (data) {
                return request.$Search(EDIT_ACTIVITY, data);
            }

        }]
    }
    return manageActsModel
})
