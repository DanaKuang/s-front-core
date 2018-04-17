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
        ServiceContent: ['$scope', 'authorization', function ($scope, auth) {
            var $model = $scope.$model;
            var defVal = {
                oldPwd: '',
                newPwd: '',
                reNewPwd: '',
                changePwd: changePwdFn,
                closePage: closePageFn
            };

            // 修改密码函数
            function changePwdFn (valid) {
                if (!valid) return;
                if ($scope.newPwd !== $scope.reNewPwd) return;

                $model.changePwd({
                    oldPwd: $scope.oldPwd || "",
                    account: sessionStorage.account || "",
                    newPwd: $scope.newPwd || ""
                }).then(function (res) {
                    var data = res.data || {};
                    if (data.ret === '200000') {
                        $(".icon-close").hide();
                        $("#tipsModalId .modal-body").html('密码修改成功,请重新登陆!');
                        setTimeout(function () {
                            auth.logout();
                        }, 3000);
                    } else {
                        console.log('接口异常！！！');
                        $("#tipsModalId .modal-body").html(data.message);
                    }
                    $("#tipsModalId").modal('show');
                });
            }

            // 取消按钮
            function closePageFn () {
                $scope = angular.extend($scope, {
                    oldPwd: '',
                    newPwd: '',
                    reNewPwd: ''
                });
            }

            //默认值
            $scope = angular.extend($scope, defVal);
        }]
    };
    return changePwdCtrl;
});
