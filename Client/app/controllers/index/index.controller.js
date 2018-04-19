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

            var COMPANY = {
                "saotianxia": "扫天下（北京）信息技术有限公司",
                "hebeizhongyan": "河北中烟工业有限责任公司",
                "henanzhongyan": "河北中烟工业有限责任公司",
                "shankunzhongyan": "山西昆烟工业有限责任公司",
                "hunanzhongyan": "湖南中烟工业有限责任公司"
            };

            // 获取数据
            $model.getNav().then(function(nav) {
                $model.getUser().then(function (user) {
                    nav = nav.data || {};
                    user = user.data.data || {};
                    sessionStorage.setItem("orgCode", user.orgCode)
                    sessionStorage.setItem("account", user.account);
                    sessionStorage.setItem("checkperson", user.account);
                    sessionStorage.setItem("company", COMPANY[user.orgCode])
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