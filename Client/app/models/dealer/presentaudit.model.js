/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function () {
    var presentauditModel = {
        ServiceType: "service",
        ServiceName: "presentauditViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return presentauditModel;
});