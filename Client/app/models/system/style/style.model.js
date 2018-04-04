/**
 * Author: liubin
 * Create Date: 2017-10-16
 * Description: style
 */
define([], function () {
    var styleModel = {
        ServiceType: "service",
        ServiceName: "styleViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return styleModel;
});