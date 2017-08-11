/**
 * Author: liubin
 * Create Date: 2017-07-20
 * Description: list
 */

define([], function () {
  var nguiNav = angular.module('ngui.list', []);

  var nguiListFn = function (util) {
    var defaults = {
      tpl: '/list.tpl.html',
      cls: '',
      list: [],
      name: ""
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
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'cls', 'name', 'type']);

      // 监视conf变化更新list
      scope.$watch('conf', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'cls', 'name', 'type']);
      }, true);
    }

    return defineObj;
  };

  nguiNav.directive('saList', ['util', nguiListFn]);
});