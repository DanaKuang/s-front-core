/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动详情
 */

define([], function () {
    var cardManagementModel = {
        ServiceType: 'service',
        ServiceName: 'cdManagementModel',
        ServiceContent: ['request', function (request) {
            this.$model = function () {
                var GET_LIST = '/api/tztx/saas/saotx/jcard/list';
                this.getlist = function () {
                    return request.$Query(GET_LIST)
                }

                var CHOOSE = '/api/tztx/saas/saotx/jcard/cardDetail';
                this.choose = function (params) {
                    return request.$Search(CHOOSE, params, true)
                }

                var CREATE_OR_MODIFY = '/api/tztx/saas/saotx/jcard/saveOrModify';
                this.createormodify = function (params) {
                    return request.$Search(CREATE_OR_MODIFY, params, true)
                }

                var MODIFYNUM = '/api/tztx/saas/saotx/jcard/modifyNum';
                this.modifyAPI = function (params) {
                    return request.$Search(MODIFYNUM, params, true)
                }

                var DELETE = '/api/tztx/saas/saotx/jcard/remove'
                this.deleteCard = function (params) {
                    return request.$Search(DELETE, params, true)
                }

            }
        }]
    };
    return cardManagementModel;
});
