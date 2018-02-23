/**
 * Author: liubin
 * Create Date: 2018-02-22
 * Description: 标签组合管理
 */

define([], function () {
    var assembleModel = {
        ServiceType: "service",
        ServiceName: "assembleViewModel",
        ServiceContent: ['request', function (request) {
            // 数据模型
            this.$model = function () {

            };
        }]
    }
    return assembleModel;
});