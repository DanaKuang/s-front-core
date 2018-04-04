/**
 * Author: 刘彬
 * Create Date: 2018-04-04
 * Description: 成员管理
 */
define([], function() {
    var userCtrl = {
        ServiceType: "controller",
        ServiceName: "userCtrl",
        ViewModelName: 'userViewModel',
        ServiceContent: ['$scope', function($scope) {
            // TODO...



            $(document).ready(function () {
                $("#id_user_form select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
            });
        }]
    };

  return userCtrl;
});