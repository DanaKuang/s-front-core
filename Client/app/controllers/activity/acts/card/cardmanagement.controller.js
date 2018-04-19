/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var cdManageCtrl = {
        ServiceType: 'controller',
        ServiceName: 'cardManagementCtrl',
        ViewModelName: 'cdManagementModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'weekService', function ($scope, df, ws) {
            var $model = $scope.$model || {};

            $scope = angular.extend($scope, {
                kp_data: {
                    cardName: '',
                    cardNum: '',
                    cardProbability: '',
                    cardPic: '',
                    cardDescribe: '',
                    cardSpecial: 1
                },
                list: [],
                cancel: cancel,
                showlist: showlist,
                saveormodify: saveormodify,
                modify: modify,
                changeNumModal: changeNumModal,
                number: 0,
                changeId: '',
                changeTotal: '',
                changeUsed: '',
                modifyNumAction: modifyNumAction,
                deleteNum: deleteNum
            });

            showlist()
            function showlist() {
                $model.getlist().then(function(res){
                    var Data = res.data || {};
                    if (Data.ret === '200000') {
                        var list = Data.data.list;
                        if (list.length > 0) {
                            $scope.list = list;
                            $scope.$apply()
                        }
                    } else {
                        alert(Data.message)
                    }
                })
            }


            $scope.change = function () {
                var files = event.target.files[0];
                var formData = new FormData();
                formData.append('file', files);
                $.ajax({
                    url: '/api/tztx/saas/saotx/attach/commonAliUpload',
                    type: 'POST',
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {
                        ContentType: "multipart/form-data",
                        loginId : sessionStorage.access_loginId,
                        token : sessionStorage.access_token
                    }
                }).done(function (res) {
                    var data = res.data || {};
                    $scope.kp_data.cardPic = data && data.accessUrl;
                    $scope.$apply();
                }).fail(function (res) {
                    alert('文件上传失败，请重试');
                    return
                })
            }

            function modify(e) {
                $model.choose({id: e.target.dataset.id}).then(function(res) {
                    var Data = res.data || {};
                    if (Data.ret === '200000') {
                        $scope.kp_data = Data.data;
                        $scope.$apply();
                        $('#modal').modal('show')
                    } else {
                        alert(Data.message)
                    }
                })
            }

            function saveormodify(e) {
                if (form.checkValidity()) {
                    $model.createormodify($scope.kp_data).then(function (res) {
                        if (res.data.ret === '200000') {
                            $scope.kp_data = {};
                            showlist()
                            alert('卡片保存成功');
                            $('#modal').modal('hide');
                            resetForm()
                        } else {
                            alert(res.data.message)
                        }
                    })
                } else {
                    alert('请确保每一项都填写')
                }
            }

            function changeNumModal(e, str) {
                var dataset = e.target.dataset;
                $scope.changeId = dataset.id;
                $scope.changeTotal = dataset.total;
                $scope.changeUsed = dataset.used;
                if (str == 'plus') {
                    $scope.mark = '增加'
                } else {
                    $scope.mark = '减去';
                }
                $('#numModal').modal('show')
            }

            function modifyNumAction() {
                var number = $scope.number;
                if ($scope.mark == '减去') {
                    if ($scope.number > (+$scope.changeTotal) - (+$scope.changeUsed)) {
                        alert('减量不得超过剩余数量')
                        return
                    } else {
                        number = '-' + $scope.number
                    }
                }
                $model.modifyAPI({
                    id: $scope.changeId,
                    cardNum: number
                }).then(function (res) {
                    if (res.data.ret === '200000') {
                        alert('数量修改成功');
                        showlist()
                        $('#numModal').modal('hide')
                    } else {
                        alert(res.data.message)
                    }
                })
            }

            function deleteNum(e) {
                $model.deleteCard({
                    id: e.target.dataset.id
                }).then(function(res) {
                    if (res.data.ret === '200000') {
                        alert('删除成功')
                        showlist()
                    } else {
                        alert(res.data.message)
                    }
                })
            }

            function cancel() {
                $scope.kp_data = {};
                resetForm()
                $('#modal').modal('hide');
            }

            function resetForm() {
                form.reset();
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                $scope.kp_data.cardSpecial = 1;
            }
        }]
    };
    return cdManageCtrl;
});