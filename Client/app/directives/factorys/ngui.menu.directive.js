/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: menu
 */

define([], function () {
  var nguiMenu = angular.module('ngui.menu', []);

  var nguiMenuFn = function ($http, $compile, $timeout, util, fetchTemplate, $location) {
    var defaults = { //默认配置
      tpl: '/menu.tpl.html',
      style: 'tab', //样式 tab,pill
      tabs: [], //选项卡数组
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
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs', 'activeId']);

      // 监视conf变化更新menu
      scope.$watch('conf', function () {
        var defHash = sessionStorage.hash || "";
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['style', 'tabs']);
        scope.activeId = sessionStorage.menuIdx || 0;
        scope.tabs = scope.conf;
        scope.tabs && scope.tabs[0].hash && $location.path(defHash.replace('#', '') || scope.tabs[0].hash.replace('#',''));
      }, true);

      // menu事件绑定
      scope.getActiveLi = function(e, item) {
          scope.activeHash = $(e.target).closest('a')[0].hash;
          var dropdown;
          for (var i = 0; i < scope.tabs.length; i++) {
              dropdown = scope.tabs[i].dropdown;
              if (dropdown && dropdown.length > 0) { //若有dropdown的话
                  for (var j = 0; j < dropdown.length; j++) {
                      if (dropdown[j].hash == scope.activeHash) {
                          scope.activeId = i; // 获得activeId
                          return;
                      }
                  }

              }
          }
      };

      // open close
      scope.clickTab = function ($event, tab, $list) {
        if (!tab.dropdown) {
          scope.activeHash = tab.hash || $($event.target).closest('a')[0].hash;
          for (var i = 0; i < scope.tabs.length; i++) {
              if (scope.tabs[i].hash == scope.activeHash) {
                  scope.activeId = i; // 获得activeId
                  // 将menu写入sessionStorage，解决刷新问题
                  sessionStorage.setItem('hash', scope.activeHash);
                  sessionStorage.setItem('menuIdx', i);
                  return;
              }
          }
        } else {
          tab.open = !tab.open;
        }
      };

      // 监听更新menu菜单
      scope.$on('updateMenu', function ($event, menu) {
        console.log(menu);
        var mTpl = attrs.tpl || defaults.tpl;
        scope.conf = scope.tabs = menu.tabs;
        // scope.$apply();
      });
    }

    return defineObj;
  };

  nguiMenu.directive('saMenu', ['$http', '$compile', '$timeout', 'util', 'fetchTemplate', '$location', nguiMenuFn]);
  return nguiMenu;
});