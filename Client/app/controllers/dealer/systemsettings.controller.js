/**
 * Author: zhaobaoli
 * Create Date: 2017-11-26
 * Description: interface
 */
define([], function() {
    var systemsettingsCtrl = {
        ServiceType: "controller",
        ServiceName: "systemsettingsCtrl",
        ViewModelName: 'systemsettingsViewModel',
        ServiceContent: ['$scope', function($scope) {
            var $model = $scope.$model;
            $model.$getSystemParam().then(function (res) {
                $scope.systemObj = res.data;
                $scope.$apply();
            });
            
            var updateObj = {};
            //是否必填推荐码
            $scope.selectRadio = function(val){
                updateObj.invitCode = val;
            }

            //确定修改参数
            $scope.comfirmUpdate = function(){
                updateObj.rewardOne = $scope.systemObj.rewardOne;
                updateObj.rewardTwo = $scope.systemObj.rewardTwo;
                updateObj.txAmount = $scope.systemObj.txAmount;
                $model.$setSystemParam(updateObj).then(function (res) {
                    if(res.data.ok){
                        $('.box_cont').html('设置成功');
                        $('.set_success_box').modal('show');
                    }else{
                        $('.box_cont').html('设置失败');
                        $('.set_success_box').modal('show');
                    }
                });
                
            }
        }]
    };

  return systemsettingsCtrl;
});