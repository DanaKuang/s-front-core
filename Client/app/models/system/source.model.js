/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: source
 */
define([], function () {
    var sourceModel = {
        ServiceType: "service",
        ServiceName: "sourceViewModel",
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                // TODO...
            };
        }]
    };
    return sourceModel;
});