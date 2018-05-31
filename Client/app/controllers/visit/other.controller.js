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
        ServiceContent: ['$rootScope', '$scope', '$timeout', 'visitManageModel', function ($rootScope, $scope, $timeout, $model) {

          // 初始化一个对象，vm
          $scope.vm = {
            time: 1,
            qr: 1,
            sign: 1
          }

          $model.querySysSetting({token: sessionStorage.access_token}).then(function(res) {
            console.log(res)
            $scope.vm = {
              time: res.data.data.SELLER_CONSUMER_ISSET || 1,
              timeText: res.data.data.SELLER_CONSUMER_THRESHOLD || '',
              qr: res.data.data.SELLER_QRPRINT_CHARGE_ISSET || 1,
              qrText: res.data.data.SELLER_QRPRINT_CHARGE_STANDARD || '',
              sign: res.data.data.SELLER_QRPRINT_SHOW_ISSET || 1,
              amountLimit: res.data.data.SELLER_TX_AMOUNT_AUTH || ''
            }
          })

          $scope.save = function() {
            if($scope.form.$valid) {
              var data = {
                settings: {
                  SELLER_CONSUMER_ISSET: $scope.vm.time, // 是否有效返利时间
                  SELLER_CONSUMER_THRESHOLD : $scope.vm.timeText || '', // 有效返利时间
                  SELLER_QRPRINT_CHARGE_ISSET: $scope.vm.qr, // 打印二维码时是否收费
                  SELLER_QRPRINT_CHARGE_STANDARD: $scope.vm.qrText || '',
                  SELLER_QRPRINT_SHOW_ISSET: $scope.vm.sign, // 是否展示“领取标牌”
                  SELLER_TX_AMOUNT_AUTH: $scope.vm.amountLimit // 提现阀值
                }
              }

              $model.sellerSysSetting(data).then(function(res) {
                if(res.data.ok) {
                  alertMsg($('#newAlert'), 'success', '保存成功');
                } else {
                  alertMsg($('#newAlert'), 'danger', res.data.msg);
                }
              })
            }
          }

          // 弹窗框
          var alertMsg = function(e, t, i) { // e为元素，t为类型，i为信息
            var promptCon = e.clone();

            if(t == 'success') { // 成功
              e.addClass('alert-success');
            } else if(t == 'warning') { // 警告
              e.addClass('alert-warning');
            } else if(t == 'danger') { // 错误
              e.addClass('alert-danger');
            }

            e.find('.prompt').text(i || '请求错误请重试');
            e.show().addClass('in');

            // 克隆的再放进body
            e.on('closed.bs.alert', function () {
              $('body').append(promptCon);
            })

            // 3秒后隐藏
            var alertHide = $timeout(function(){
              e.alert('close')
            }, 3000)

            e.hover(function() {
              $timeout.cancel(alertHide);
            }, function() {
              // 3秒后隐藏
              var alertHide = $timeout(function(){
                e.alert('close')
              }, 3000)
            })
          }
        }]
    };

    return visitOtherCtrl;
})
