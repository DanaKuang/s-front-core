/**
 * Author: liubin
 * Create Date: 2017-10-11
 * Description: 修改密码
 */
define([], function () {
    var changePwdCtrl = {
        ServiceName: 'changePwdCtrl',
        ServiceType: 'controller',
        ViewModelName: 'changePwdViewModel',
        ServiceContent: ['$scope', function ($scope) {
            var $model = $scope.$model;

            var default = {
                account: '',
                newPwd: '',
                reNewPwd: '',
                error: false,
                changepwd: function () {
                    if ($scope.error) {
                        return;
                    }
                    $model.changePwd({
                        account: $scope.account,
                        newPwd: $scope.newPwd
                    }).then(function (res) {
                        console.log(res);
                    });
                },
                closepage: function () {
                    //取消按钮
                    console.log('closepage...');
                }
            };
            //默认值
            $scope = angular.extend($scope, default);
        }]
    };
    return changePwdCtrl;
});