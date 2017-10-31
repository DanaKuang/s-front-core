/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function () {
    var interfaceModel = {
        ServiceType: "service",
        ServiceName: "interfaceViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return interfaceModel;
});