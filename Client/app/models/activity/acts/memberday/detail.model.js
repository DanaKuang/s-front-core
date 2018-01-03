/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动详情
 */

define([], function () {
    var memberDayDetailModel = {
        ServiceType: 'service',
        ServiceName: 'mdDetailModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                console.log('mdDetail model is under control.');
            };
        }]
    };
  return memberDayDetailModel;
});
