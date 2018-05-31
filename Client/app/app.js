/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: app
 */

require([
  "services/_services.min.js",
  "filters/_filters.min.js",
  "models/_models.min.js",
  "directives/_directives.min.js",
  "controllers/_controllers.min.js"
], function (controller, directive, service, filter) {

  /**
   * cm controller.min
   * dm directive.min
   * sm service.min
   * mm model.min
   *
   * [app description]
   * @type {[type]}
   */
  var app = angular.module('tztx.saas', ['tztx.saas.sm', 'tztx.saas.dm', 'tztx.saas.mm', 'tztx.saas.cm', 'tztx.saas.fm']);

  // 配置初始化入口
  app.run(['$dynamicRoute', 'menuService', function($dynamicRoute, menuService) {
    menuService.animation();
  }]);

  // 启动app，检查授权
  angular.injector(['tztx.saas.sm']).get('authorization').done();

});