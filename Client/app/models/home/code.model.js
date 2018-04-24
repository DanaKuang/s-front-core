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
            var GET_BRAND_DATA = "/api/tztx/dataportal/public/getUserBrandByUserId";        // 获取品牌
            var GET_PRODUCT_DATA = "/api/tztx/dataportal/actAnalysis/getActyProductDownBox";// 获取规格
            var GET_FACK_LIST = "/api/tztx/saas/saotx/fake/list"                            // 获取假码列表
            var EXPORT_FACK_LIST = "/api/tztx/saas/saotx/fake/export";                      // 导出列表数据
            var DEL_FUCK_DATA = "/api/tztx/saas/saotx/fake/remove";                         // 删除某一条记录

            // 品牌
            this.$brand = request.$Search(GET_BRAND_DATA, {}, true);

            // 根据品牌获取规格
            this.getProduct = function (params) {
                return request.$Search(GET_PRODUCT_DATA, params, true);
            };

            // 获取假码表格数据
            this.getFackList = function (params) {
                return request.$Search(GET_FACK_LIST, params);
            };

            // 删除
            this.delFack = function (params) {
                return request.$Search(DEL_FUCK_DATA, params);
            };

            // 导出
            this.exportList = function (params) {
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                for(var attr in params) {
                    formData.append(attr, params[attr]);
                }
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.open('POST', EXPORT_FACK_LIST, true);
                xhr.responseType = "blob";
                xhr.responseType = "arraybuffer"
                xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
                xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
                xhr.onload = function(res) {
                    if (this.status == 200) {
                        var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
                        var respHeader = xhr.getResponseHeader("Content-Disposition");
                        var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
                        if (window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, fileName);
                        } else {
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = fileName;
                            link.click();
                            window.URL.revokeObjectURL(link.href);
                        }
                    }
                }
                return xhr.send(formData);
            };
        };
    }]
  };
  return codeModel;
});