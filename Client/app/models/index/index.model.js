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

      // $model.getMenuJson = function () {
      //   return request.$Query(GET_MENU_TOPBAR);
      // };
      $model.getNavJson = function () {
        return request.$Query(GET_NAV_JSON);
      };
    }]
  };

  return mainModel;
});
