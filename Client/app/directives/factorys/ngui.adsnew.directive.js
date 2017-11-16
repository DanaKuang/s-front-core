/**
 * Author: Kuang
 * Create Date: 2017-07-20
 * Description: 新建广告
 */

define([], function () {
  var nguiAdsnew = angular.module('ngui.adsnew', []);

  var nguiActsampleFn = function ($rootScope, $http, $compile, $timeout, util) {
    var defaults = { //默认配置
      tpl: '/adsnew.tpl.html',
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

      // 上传图片
      scope.fileChange = function() {
        var files = event.target.files[0];

        var formData = new FormData();
        formData.append('file', files);
        scope.$emit('uploadImage', event, formData);
      }

      // 设置单选 默认选中
      scope.adsType = true;
      // scope.radioChange = function() {
      //   // scope.adsType = !adsType;
      //   console.log(scope.adsType)
      // }


      // 新增
      scope.createAds = function() {
        scope.$emit('createAds', event, this.ads);
      }

      // 获取礼品列表
      scope.getGiftList = function() {
        scope.$emit('getGiftList', event);
      }

      //  广告图片
      scope.adsImageShow = false;
      scope.adsImage = '';
      // 获取礼品列表
      scope.adsImgClose = function() {
        scope.adsImageShow = false;
        scope.adsImage = '';
      }

      // 礼物图片是否显示
      scope.imgshow = false;
      scope.giftId = '';
      // 获取礼品列表
      scope.giftClose = function() {
        scope.imgshow = false;
        scope.giftId = '';
      }
    }
    return defineObj;
  }

  nguiAdsnew.directive('saAdsnew', ['$rootScope', '$http', '$compile', '$timeout', 'util', nguiActsampleFn]);
})
