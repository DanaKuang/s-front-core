/**
 * Author: liubin
 * Create Date: 2017-10-11
 * Description: 修改密码
 */
define([], function () {
    var changePwdViewModel = {
        ServiceName: 'changePwdViewModel',
        ServiceType: 'service',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var CHANGE_PWD_API = '/api/tztx/admin/user/modifyPwd';

                // 修改密码
                this.changePwd = function (params) {
                    return request.$Search(CHANGE_PWD_API, params, true);
                }
            }
        }]
    };
    return changePwdViewModel;
});