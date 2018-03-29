/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */
define([], function () {
    var visitManageModel = {
        ServiceType: "service",
        ServiceName: "visitManageModel",
        ServiceContent: ['request', function (request) {

          //定义资源
          var $model = this;

          // 表格列表
          var GET_MANAGE_LIST = '/api/tztx/seller-manager/seller/select/newList';
          $model.getManageList = function (data) {
            return request.$Search(GET_MANAGE_LIST, data)
          }

          // 省
          var GET_MANAGE_PROVINCE = '/api/tztx/seller-manager/region/province';
          $model.getManageProvince = function () {
            return request.$Search(GET_MANAGE_PROVINCE, {}, true)
          }

          // 市
          var GET_MANAGE_CITY = '/api/tztx/seller-manager/region/newCity';
          $model.getManageCity = function (data) {
            return request.$Search(GET_MANAGE_CITY, data, true)
          }

          // 区/县
          var GET_MANAGE_COUNTRY = '/api/tztx/seller-manager/region/newDistrict';
          $model.getManageCountry = function (data) {
            return request.$Search(GET_MANAGE_COUNTRY, data, true)
          }


          // *** 审核管理 start
          // 审核
          var REVIEW_MANAGE = '/api/tztx/seller-manager/seller/approvalBatch';
          $model.reviewAndPass = function (data) {
            return request.$Search(REVIEW_MANAGE, data)
          }
          // *** 审核管理 end


          // *** 零售户管理 start
          // 新增保存、编辑保存
          var NEW_MANAGE_SAVE = '/api/tztx/seller-manager/seller/saveOrUpdateSeller';
          $model.newManageSave = function (data) {
            return request.$Search(NEW_MANAGE_SAVE, data)
          }

          // 详情
          var GET_MANAGE_DETIAL = '/api/tztx/seller-manager/seller/select/detail';
          $model.getManageDetialInfo = function (data) {
            return request.$Search(GET_MANAGE_DETIAL, data)
          }

          // 详情 - 店铺粉丝
          var GET_MANAGE_DETIAL_FANS = '/api/tztx/seller-manager/seller/querySellerFans';
          $model.getManageDetialSellerFans = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_FANS, data)
          }

          // 详情 - 扫码返现
          var GET_MANAGE_DETIAL_BACK = '/api/tztx/seller-manager/seller/select/newFxlist';
          $model.getManageDetialCashback = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_BACK, data)
          }

          // 详情 - 账单流水
          var GET_MANAGE_DETIAL_BILL = '/api/tztx/seller-manager/seller/accountFlow';
          $model.getManageDetialBill = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_BILL, data)
          }

          // 详情 - 入库明细
          var GET_MANAGE_DETIAL_STORAGE = '/api/tztx/seller-manager/seller/scanInstore';
          $model.getManageDetialStorage = function (data) {
            return request.$Search(GET_MANAGE_DETIAL_STORAGE, data)
          }

          // 上下架
          var GET_MANAGE_AUTHORG = '/api/tztx/seller-manager/seller/modifyAuthOrg';
          $model.modifyAuthOrg = function (data) {
            return request.$Search(GET_MANAGE_AUTHORG, data)
          }
          // *** 零售户管理 end


          // *** 订单管理 start
          // 列表
          var ORDER_GET_LIST = '/api/tztx/seller-manager/order/queryList';
          $model.orderGetList = function (data) {
            return request.$Search(ORDER_GET_LIST, data)
          }
          // 详情
          var ORDER_GET_DETIAL = '/api/tztx/seller-manager/order/queryDetailByOrderid';
          $model.queryDetailByOrderid = function (data) {
            return request.$Search(ORDER_GET_DETIAL, data)
          }
          // 取消订单
          var ORDER_CANCEL = '/api/tztx/seller-manager/order/cancelOrder';
          $model.cancelOrder = function (data) {
            return request.$Search(ORDER_CANCEL, data)
          }
          // 修改订单收货信息
          var ORDER_MODIFY = '/api/tztx/seller-manager/order/modifyOrder';
          $model.modifyOrder = function (data) {
            return request.$Search(ORDER_MODIFY, data)
          }
          // 导出
          var ORDER_EXPORT = '/api/tztx/seller-manager/order/exportOrders';
          $model.exportOrders = function (data) {
            return request.$Search(ORDER_EXPORT, data)
          }
          // 导入
          var ORDER_IMPORT = '/api/tztx/seller-manager/order/readOrderData';
          $model.readOrderData = function (data) {
            return request.$Search(ORDER_IMPORT, data)
          }
          // *** 订单管理 end


          // *** 扫码入库奖励管理 start
          // 列表
          var STORAGE_GET_LIST = '/api/tztx/seller-manager/setting/scanInstoreRebateList';
          $model.getStorageManageList = function (data) {
            return request.$Search(STORAGE_GET_LIST, data)
          }
          // 详情 头部
          var STORAGE_GET_DETIAL = '/api/tztx/seller-manager/setting/instoreSettingDetail';
          $model.getStorageDetial = function (data) {
            return request.$Search(STORAGE_GET_DETIAL, data)
          }
          // 详情 表格
          var STORAGE_GET_DETIAL_LIST = '/api/tztx/seller-manager/seller/sisSettingSellers';
          $model.getStorageDetialList = function (data) {
            return request.$Search(STORAGE_GET_DETIAL_LIST, data)
          }
          // 启用、禁用
          var STORAGE_SET_ENABLED = '/api/tztx/seller-manager/setting/modifyInstoreSettingStatus';
          $model.setStorageEnabled = function (data) {
            return request.$Search(STORAGE_SET_ENABLED, data)
          }
          // new
          var STORAGE_NEW = '/api/tztx/seller-manager/setting/souInstoreSetting';
          $model.newStorage = function (data) {
            return request.$Search(STORAGE_NEW, data)
          }

          // 积分
          var GET_PRODUCT_CHOOSE_LIST = '/api/tztx/saas/saotx/product/queryMetraList';
          $model.getProductChooseList = function (data) {
            return request.$Search(GET_PRODUCT_CHOOSE_LIST, data);
          }
          // *** 扫码入库奖励管理 end


          // *** 返佣管理 - 扫码返佣 start
          // 品牌
          var REBATE_GET_BRANDS = '/api/tztx/saas/saotx/common/queryBrandWithRight';
          $model.rebateGetBrands = function (data) {
            return request.$Search(REBATE_GET_BRANDS, data, true)
          }
          // 规格
          var REBATE_GET_SPEC = '/api/tztx/saas/saotx/common/queryProduct';
          $model.rebateGetSpec = function (data) {
            return request.$Search(REBATE_GET_SPEC, data, true)
          }
          // 地区
          var GET_ALL_REGION = '/api/tztx/seller-manager/region/queryAllRegion';
          $model.queryAllRegion = function (data) {
            return request.$Search(GET_ALL_REGION, data);
          }
          // 活动类型
          var REBATE_GET_ACT_TYPE = '/api/tztx/saas/saotx/common/queryDimActivatyForm';
          $model.rebateGetActType = function (data) {
            return request.$Search(REBATE_GET_ACT_TYPE, data, true)
          }
          // 活动状态
          var REBATE_GET_ACT_STATUS = '/api/tztx/saas/saotx/common/queryDimDataStatus';
          $model.rebateGetActStatus = function (data) {
            return request.$Search(REBATE_GET_ACT_STATUS, data, true)
          }

          // 列表
          var REBATE_GET_LIST = '/api/tztx/seller-manager/setting/activityRebateList';
          $model.getRebateManageList = function (data) {
            return request.$Search(REBATE_GET_LIST, data)
          }

          // 扫码返佣比例设置
          var REBATE_SET = '/api/tztx/seller-manager/setting/setActivityRebate';
          $model.setActivityRebate = function (data) {
            return request.$Search(REBATE_SET, data)
          }
          // *** 返佣管理 - 扫码返佣 end


          // *** 其他系统配置 start
          // 获取
          var OTHER_GET_SETTING = '/api/tztx/seller-manager/setting/querySysSetting';
          $model.querySysSetting = function (data) {
            return request.$Search(OTHER_GET_SETTING, data, true)
          }
          // 保存
          var OTHER_SAVE_SETTING = '/api/tztx/seller-manager/setting/sellerSysSetting';
          $model.sellerSysSetting = function (data) {
            return request.$Search(OTHER_SAVE_SETTING, data, true)
          }
          // *** 其他系统配置 end

          //*** 提现审核 start
          var AMOUNT_EXAMINE_LINT = '/api/tztx/seller-manager/seller/txList'; //获取提现审核列表
          $model.amountExamineList = function (data) {
            return request.$Search(AMOUNT_EXAMINE_LINT, data, false)
          }
          var PROVINCE_LIST = '/api/tztx/dataportal/fxback/getProvince';//省份
          $model.getProvinceList = function () {
            return request.$Search(PROVINCE_LIST, {}, true)
          }
          var CITY_LIST = '/api/tztx/dataportal/fxback/getCity';//地市
          $model.getCityList = function (data) {
            return request.$Search(CITY_LIST, data, true)
          }
          var AREA_LIST= '/api/tztx/dataportal/fxback/getCountry';//区县
          $model.getAreaList = function (data) {
            return request.$Search(AREA_LIST, data, true)
          }
          var TX_STATUS = '/api/tztx/seller-manager/seller/txAuth'; //修改提现审核状态
          $model.setTxStatus = function (data) {
            return request.$Search(TX_STATUS, data, false)
          }

          //*** 提现审核 end
          
          //*** 业绩设置 start 
          var achieveListUrl = '/api/tztx/seller-manager/achieve/queryList'; //获取业绩列表
          $model.getAchieveList= function (data) {
            return request.$Search(achieveListUrl, data, true)
          }
          var saveOrUpdateAchUrl = '/api/tztx/seller-manager/achieve/saveOrModify'; //保存或修改业绩配置
          $model.saveOrUpdateAch= function (data) {
            return request.$Search(saveOrUpdateAchUrl, data, true)
          }
          var getAchDetilUrl = '/api/tztx/seller-manager/achieve/configDetail'; //获取业绩设置详情
          $model.getAchDetil= function (data) {
            return request.$Search(getAchDetilUrl, data, true)
          }
          var getPeriodResultListUrl = '/api/tztx/seller-manager/achieve/periodResultList'; //获取业绩排名详情
          $model.getPeriodResultList= function (data) {
            return request.$Search(getPeriodResultListUrl, data, true)
          }
          var getQueryAwardListUrl = '/api/tztx/seller-manager/achieve/queryAwardList'; //获取业绩排名名次
          $model.getQueryAwardList= function (data) {
            return request.$Search(getQueryAwardListUrl, data, true)
          }
          var payAchievementUrl = '/api/tztx/seller-manager/achieve/payAchievement'; //派发奖金到中奖用户
          $model.payAchievement = function (data) {
            return request.$Search(payAchievementUrl, data, true)
          }
          var sendWechatTemplateUrl = '/api/tztx/seller-manager/achieve/sendWechatTemplate'; //发送模板消息
          $model.sendWechatTemplate = function (data) {
            return request.$Search(sendWechatTemplateUrl, data, true)
          }

          //*** 业绩设置 start 

        }]
    };
    return visitManageModel;
})