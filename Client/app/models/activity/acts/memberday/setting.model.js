/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDaySettingModel = {
        ServiceType: 'service',
        ServiceName: 'mdSettingModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                console.log('mdSetting model is under control.');
            };
        }]
    };
  return memberDaySettingModel;
});
