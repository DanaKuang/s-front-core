/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: multi
 */

define([], function () {
  var multiModel = {
    ServiceType: 'service',
    ServiceName: 'multiViewModel',
    ServiceContent: ['request', function (request) {
      this.$model = function () {
        var MODALS_JSON = "statics/home/multi/modals.json";                       // 模版弹窗模型

        var TMP_JSON = "statics/home/multi/tmp_list.json";                        // 引用模版list
        var HIS_JSON = "statics/home/multi/his_list.json";                        // 历史模版list

        // table
        var PACKET_TABLE_CONF = "statics/home/multi/packet_tableConf.json";       // 红包表格配置
        var REAL_TABLE_CONF = "statics/home/multi/real_tableConf.json";           // 实物表格配置
        var SCAN_TABLE_CONF = "statics/home/multi/scan_tableConf.json";           // 扫码表格配置
        var TARGET_TABLE_CONF = "statics/home/multi/target_tableConf.json";       // 规格表格配置

        // table
        var PACKET_TABLE_DATA = "/api/tztx/dataportal/statistics/getMultiCashData";  // 红包表格数据
        var REAL_TABLE_DATA = "/api/tztx/dataportal/statistics/getMultiGoodData";    // 实物表格数据
        var SCAN_TABLE_DATA = "/api/tztx/dataportal/statistics/getMultiScanData";    // 扫码表格数据
        var TARGET_TABLE_DATA = "/api/tztx/dataportal/statistics/getMultiKPIData";   // 规格表格数据

        var HISTORY_API = "/api/tztx/dataportal/statistics/getQueryRecord";       // 历史查询接口
        var SAVE_HISTORY_API = "/api/tztx/dataportal/statistics/saveQueryRecord"; // 保存查询接口

        // 查询
        var GET_BRAND_DATA = "/api/tztx/dataportal/statistics/getBrand";            // 获取品牌
        var GET_PRODUCT_DATA = "/api/tztx/dataportal/statistics/getProductOfNoNuit";// 获取规格
        var GET_CITY_DATA = "/api/tztx/dataportal/statistics/getCitysByProvince";   // 获取市
        var GET_PROVINCE_DATA = "/api/tztx/dataportal/statistics/getProvince";      // 获取省

        this.$modals = request.$Query(MODALS_JSON);

        this.$packet = request.$Query(PACKET_TABLE_CONF);
        this.$real = request.$Query(REAL_TABLE_CONF);
        this.$scan = request.$Query(SCAN_TABLE_CONF);
        this.$target = request.$Query(TARGET_TABLE_CONF);

        // 表格测试数据
        var TEST_TABLE_DATA = "statics/home/multi/test_tableData.json";           // 表格测试数据

        // 规格
        this.$testTableData = request.$Query(TEST_TABLE_DATA);

        // 获取品牌
        this.$brand = request.$Search(GET_BRAND_DATA, {}, true);
        // 根据品牌获取规格
        this.getProduct = function (params) {
          return request.$Search(GET_PRODUCT_DATA, params, true);
        };
        // 获取省
        this.getProvince = function (params) {
          return request.$Search(GET_PROVINCE_DATA, params, true);
        };
        // 根据省获取市
        this.getCity = function (params) {
          return request.$Search(GET_CITY_DATA, params, true);
        };

        // 模版
        this.getTmpData = function () {
          return request.$Query(TMP_JSON);
        };

        // 保存查询
        this.saveSearch = function (params) {
          return request.$Search(SAVE_HISTORY_API, params, true);
        };

        // 历史
        this.getHisData = function (params) {
          return request.$Search(HISTORY_API, params, true);
        };

        // 红包表格
        this.getPacket = function (params) {
          return request.$Search(PACKET_TABLE_DATA, params, true);
        };
        // 实物表格
        this.getReal = function (params) {
          return request.$Search(REAL_TABLE_DATA, params, true);
        };
        // 扫码表格
        this.getScan = function (params) {
          return request.$Search(SCAN_TABLE_DATA, params, true);
        };
        // 指标表格
        this.getTarget = function (params) {
          return request.$Search(TARGET_TABLE_DATA, params, true);
        };

      };
    }]
  };

  return multiModel;
});