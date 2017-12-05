/**
 * Author: {author}
 * Create Date: {date}
 * Description: {desp}
 */

define([], function () {
    var analysisModel = {
        ServiceType: 'service',
        ServiceName: 'analysisViewModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                console.log('analysisModel loading...');
            };
        }]
    };

    return analysisModel;
});