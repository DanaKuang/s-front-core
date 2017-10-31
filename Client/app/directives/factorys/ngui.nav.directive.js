/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: nav
 */

define([], function () {
  var nguiNav = angular.module('ngui.nav', []);

  var nguiNavFn = function ($rootScope, $http, $compile, $timeout, util, auth) {
    var defaults = { //默认配置
        tpl: '/nav.tpl.html',
        nav: [], //选项卡数组
        account: "",
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
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nav', 'style', 'account', 'activeId']);

        // 监视conf变化更新nav
        scope.$watch('conf', function () {
            // 属性赋值
            util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['nav', 'style', 'account', 'activeId']);
            scope.nav.length && scope.changeNav({}, sessionStorage.navCode ? {
                menuCode: sessionStorage.navCode
            } : scope.nav[0]);
        }, true);

        // nav切换事件绑定
        scope.changeNav = function (e, n) {
            scope.activeNav = n;
            _.each(scope.nav, function (v, i) {
                if (v.menuCode == n.menuCode) {
                    scope.activeId = i;
                    sessionStorage.setItem('navCode', n.menuCode);
                }
            });
            scope.$emit('navchangeready', n);
        };

        // 退出登陆
        scope.webLogout = auth.logout;

        // 修改密码
        scope.changePassword = function () {
            scope.changeNav(null, {menuCode: 'sysManage'});
            sessionStorage.setItem('menuCode', 'pwdChange');
        };
      }
      return defineObj;
  };

  nguiNav.directive('saNav', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'authorization', nguiNavFn]);
});