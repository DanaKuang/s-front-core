/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
  var MainCtrl = {
    ServiceType: "controller",
    ServiceName: "MainCtrl",
    ViewModelName: 'mainViewModel',
    ServiceContent: ['$scope', 'mainViewModel', function ($scope, $model) {
      // 定义模型

      // nav模型数值绑定
      $model.getNavJson().then(function (res) {
        $scope.navConf = res.data;
      });

      // 获取数据
      $model.getNav().then(function (res) {
        var data = res.data || {};

        // $scope.navConf =

      });

      // $model.getMenu({
      //   parentCode: "0"
      // }).then(function (res) {
      //   console.log(res.data);
      // });
    }]
  };

  return MainCtrl;
});