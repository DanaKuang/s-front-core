/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
  var mainModel = {
    ServiceType: "service",
    ServiceName: "mainViewModel",
    ServiceContent: ['request', function (request) {
      //定义资源
      var $model = this;
      var GET_MENU_TOPBAR = "/statics/index/menu.json";
      var GET_NAV_JSON = "/statics/index/nav.json";

      var GET_NAV_DATA = "/api/tztx/saas/saotx/menu/user_list_moudle";
      var GET_MENU_DATA = "/api/tztx/saas/saotx/menu/user_list_menu";

      $model.getNavJson = function () {
        return request.$Query(GET_NAV_JSON);
      };

      // 顶部导航
      $model.getNav = function () {
        return request.$Search(GET_NAV_DATA);
      };

      // 左侧菜单
      $model.getMenu = function (params) {
        return request.$Search(GET_MENU_DATA, params)
      };

    }]
  };

  return mainModel;
});
