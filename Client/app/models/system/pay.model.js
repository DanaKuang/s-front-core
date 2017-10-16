/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: pay
 */
define([], function () {
    var payModel = {
        ServiceType: "service",
        ServiceName: "payViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return payModel;
});