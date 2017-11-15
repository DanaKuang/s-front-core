/**
 * Author: Kuang
 * Create Date: 2017-07-20
 * Description: 新建广告
 */

define([], function () {
  var nguiAdsenseedit = angular.module('ngui.adsenseedit', []);

  var nguiActsampleFn = function ($rootScope, $http, $compile, $timeout, util) {
    var defaults = { //默认配置
      tpl: '/adsenseedit.tpl.html',
      adsnewList: [],
      // type: ''
    };
    var defineObj = { //指令定义对象
      restrict: 'AE',
      replace: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.tpl || defaults.tpl;
      },
      scope: {
        conf: '=' //原来是=
      },
      link: linkFn
    };

    function linkFn (scope, element, attrs) {
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['adsnewList', 'type']);

      // 监视conf变化更新page
      scope.$watch('conf', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['adsnewList', 'type']);

        scope.adsnewList = scope.conf && scope.conf.data;
      }, true);

      scope.newActSample = function(e, type) {
        var typeData = {
            type: type
        };
        scope.type = type;
        scope.$emit('typefromActSample', event, typeData);
        $('.modal-content .close').trigger('click');
      }

      // 设置单选 默认选中
      scope.adsType = 'true';
      // scope.radioChange = function() {
      //   // scope.adsType = !adsType;
      //   console.log(scope.adsType)
      // }

      // 编辑
      scope.updateAds = function() {
        scope.$emit('updateAds', event);
      }
    }
    return defineObj;
  }

  nguiAdsenseedit.directive('saAdsenseedit', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiActsampleFn]);
})
