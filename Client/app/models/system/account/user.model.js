/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: user
 */
define([], function () {
    var userModel = {
        ServiceType: "service",
        ServiceName: "userViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return userModel;
});