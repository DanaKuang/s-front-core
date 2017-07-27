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

      // menu模型数值绑定
      // $model.getMenuJson().then(function (res) {
      //   $scope.menuConf = res.data;
      // });

      // nav模型数值绑定
      $model.getNavJson().then(function (res) {
        $scope.navConf = res.data;
      });
    }]
  };

  return MainCtrl;
});