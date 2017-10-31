/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: adsense
 */
define([], function () {
    var adsenseModel = {
        ServiceType: "service",
        ServiceName: "adsenseViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return adsenseModel;
});