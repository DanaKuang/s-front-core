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
            var FIX_PWD = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%\^&*?]{4,16}$/;
            var defaultVal = {
                account: '',
                newPwd: '',
                reNewPwd: '',
                checkold: function (acc) {
                    if (!acc) {
                        $scope.oldpwd = true;
                    } else {
                        $scope.oldpwd = false;
                    }
                },
                checkpwd: function (pwd) {
                    if (FIX_PWD.test(pwd)) {
                        $scope.newpwd = true;
                    } else {
                        $scope.newpwd = false;
                    }
                    if ($scope.reNewPwd && $scope.reNewPwd !== pwd) {
                        $scope.nr = true;
                    } else {
                        $scope.nr = false;
                    }
                },
                checkrepwd: function (pwd) {
                    if ($scope.newPwd !== pwd) {
                        $scope.nr = true;
                    } else {
                        $scope.nr = false;
                    }
                },
                changepwd: function () {
                    this.checkold($scope.account);
                    this.checkpwd($scope.newPwd);
                    this.checkrepwd($scope.reNewPwd);
                    if ($scope.oldpwd || $scope.newpwd || $scope.nr) {
                        return;
                    }
                    $model.changePwd({
                        account: $scope.account,
                        newPwd: $scope.newPwd
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
                },
                closepage: function () {
                    //取消按钮
                    history.go(0);
                }
            };
            //默认值
            $scope = angular.extend($scope, defaultVal);
        }]
    };
    return changePwdCtrl;
});