/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: nav
 */

define([], function () {
  var nguiNav = angular.module('ngui.nav', []);

  var nguiNavFn = function ($rootScope, $http, $compile, $timeout, util) {
    var defaults = { //默认配置
      tpl: '/nav.tpl.html',
      nav: [], //选项卡数组
      activeId: 0 // 默认标记第一个active
    };
    var defineObj = { //指令定义对象
      restrice: 'AE',
      replace: true,
      templateUrl: function(tElement, tAttrs) {
          return tAttrs.tpl || defaults.tpl;
      },
      scope: {
          conf: '='
      },
      link: linkFn
    };

    // link
    function linkFn (scope, element, attrs) {
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nav', 'style', 'activeId']);

      // 监视conf变化更新nav
      scope.$watch('conf', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nav', 'style', 'active']);
        scope.activeId = sessionStorage.navIdx || 0;
        scope.nav.length && updateMenu(scope.nav[scope.activeId]);
      }, true);

      // 更新菜单
      function updateMenu (menu) {
        $rootScope.$broadcast('updateMenu', menu);
      }

      // nav切换事件绑定
      scope.changeNav = function (e, n) {
        scope.activeNav = n;
        for (var i = 0;i < scope.nav.length; i++) {
          if (scope.nav[i].hash === scope.activeNav.hash) {
            scope.activeId = i;
            sessionStorage.setItem('navIdx', i)
            updateMenu(n);
          }
        }
      };
    }
    return defineObj;
  };

  nguiNav.directive('saNav', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiNavFn]);
});