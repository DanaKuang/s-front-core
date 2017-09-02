/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function() {
    var MainCtrl = {
        ServiceType: "controller",
        ServiceName: "MainCtrl",
        ViewModelName: 'mainViewModel',
        ServiceContent: ['$scope', 'mainViewModel', 'menuFilter', function($scope, $model, menuFilter) {

            // nav模型数值绑定
            // $model.getNavJson().then(function (res) {
            //      $scope.navConf = res.data;
            // });
            var USERMAP = {
                hunanzhongyan: "hunan",
                henanzhongyan: "henan",
                saotianxia: "hunan"
            };

            // 获取数据
            $model.getNav().then(function(nav) {
                $model.getUser().then(function (user) {
                    nav = nav.data || {};
                    user = user.data.data || {};
                    sessionStorage.setItem("account", USERMAP[user.orgCode]);
                    $scope.navConf = {
                        nav: menuFilter.nav(nav.data),
                        account: user.name || ""
                    };
                });
            });

            // 获取menu
            $scope.$on('navchangeready', function(e, v) {
                $model.getMenu({
                    parentCode: v.menuCode || "index"
                }).then(function(res) {
                    var menu = res.data || {};
                    $scope.menuConf = {
                        tabs: menuFilter.menu(menu.data)
                    };
                });
            });
        }]
    };

  return MainCtrl;
});