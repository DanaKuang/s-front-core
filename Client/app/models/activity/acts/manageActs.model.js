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
            // 活动列表
            var GET_ACTIVITY_LIST = '/api/tztx/saas/saotx/activity/list';
            // 模板列表
            var GET_ACT_SAMPLE_LIST = '/api/tztx/saas/saotx/common/queryDimActivatyForm';
            // 模板列表对应的配置弹窗
            var GET_TEMPLATE_SPECIFIC = '/api/tztx/saas/saotx/template/template_common_list';
            // 厂家

            // 品牌

            // 规格

            // 地区
            var GET_TIER_AREA = '/api/tztx/saas/saotx/common/queryRegionByParentCode';
            var GET_AREA_LIST = '/api/tztx/saas/saotx/common/queryAllRegion';

            // 新增活动
            var ADD_NEW_ACTIVITY = '/api/tztx/saas/saotx/activity/update';

            // 获取活动列表、页码
            $model.getActivityList = function (data) {
                return request.$Search(GET_ACTIVITY_LIST, data)
            }

            // 获取活动模板，是九宫格、大转盘、还是刮刮卡...
            $model.getActSampleList = function () {
                return request.$Search(GET_ACT_SAMPLE_LIST)
            }

            // 获取模板对应的配置页面
            $model.getTemplateSpecific = function (data) {
                return request.$Search(GET_TEMPLATE_SPECIFIC, data)
            }

            // 获取厂家

            // 获取品牌

            // 获取规格

            // 获取地区
            $model.getTierArea = function (data) {
                return request.$Search(GET_TIER_AREA, data);
            }

            $model.getAreaList = function () {
                return request.$Search(GET_AREA_LIST)
            }

            // 新增活动
            $model.addNewActivity = function (data) {
                return request.$Search(ADD_NEW_ACTIVITY, data)
            }

        }]
    }
    return manageActsModel
})
