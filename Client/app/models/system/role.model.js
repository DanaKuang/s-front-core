/**
 * Author: liubin
 * Create Date: 2017-10-16
 * Description: role
 */
define([], function () {
    var roleModel = {
        ServiceType: "service",
        ServiceName: "roleViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return roleModel;
});