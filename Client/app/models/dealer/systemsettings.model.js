/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: interface
 */
define([], function () {
    var systemsettingsModel = {
        ServiceType: "service",
        ServiceName: "systemsettingsViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return systemsettingsModel;
});