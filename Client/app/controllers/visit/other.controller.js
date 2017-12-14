/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
    var visitOtherCtrl = {
        ServiceType: "controller",
        ServiceName: "visitOtherCtrl",
        ViewModelName: 'visitManageModel',
        ServiceContent: ['$rootScope', '$scope', 'visitManageModel', function ($rootScope, $scope, $model) {

          // 初始化一个对象，vm
          $scope.vm = {
            time: 1,
            qr: 1,
            sign: 1
          }

          $scope.vm.save = function() {
            if($scope.form.$valid) {
              var data = {
                settings: {
                  SELLER_CONSUMER_ISSET: $scope.vm.time, // 是否有效返利时间
                  SELLER_QRPRINT_CHARGE_ISSET: $scope.vm.qr, // 打印二维码时是否收费
                  SELLER_QRPRINT_SHOW_ISSET: $scope.vm.sign // 是否展示“领取标牌”
                }
              }

              if($scope.vm.time == 1) {
                data.settings.SELLER_CONSUMER_THRESHOLD = $scope.vm.timeText || ''; // 有效返利时间
              }
              if($scope.vm.qr == 1) {
                data.settings.SELLER_QRPRINT_CHARGE_STANDARD = $scope.vm.qrText || ''; // 收费标准
              }

              $model.sellerSysSetting(data).then(function(res) {
              })
            }
          }
        }]
    };

    return visitOtherCtrl;
})
