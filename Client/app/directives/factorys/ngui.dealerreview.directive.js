/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商审核 表格 指令
 */

define([], function () {
  var review = angular.module('ngui.dealerreview', []);

  var reviewFn = function ($rootScope, $http, $compile, $timeout, util, $model) {
    var defaults = { //默认配置
      tpl: '/dealerreview.tpl.html',
      list: [],
      totalCount: 0,
      size: 0,
      curPage: 1,
      pageNumber: 1
    };

    var defineObj = { //指令定义对象
      restrict: 'AE',
      replace: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.tpl || defaults.tpl;
      },
      // zha: conf？？？conf是调用指令标签的属性
      scope: {
        conf: '=' // =进行的是双向的数据绑定
      },
      // zha: link函数主要用于操作dom元素,给dom元素绑定事件和监听.
      link: linkFn
    };

    //scope: 指令所在的作用域; element：指令元素的封装，可以调用angular封装的简装jq方法和属性; attrs：指令元素的属性的集合
    function linkFn (scope, element, attrs) {
      // fixme: util.uiExtend作用是？？？
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

      // 监视conf变化更新page，也就是监听reviewConf，自定义指令的属性在指令的scope下。
      scope.$watch('conf', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

        // zha: 一开始进入页面的时候scope.conf是undefined  scope.conf什么时候被赋值了呢,下面是分页吗？？？conf是在directive的属性里设置的，是分页。
        if (scope.conf) {
          var data = scope.conf.data;
          var page = data.page;
          scope.list = data.list;
          scope.totalCount = page.count;
          scope.size = page.count - page.start > page.pageSize ? page.pageSize : page.count - page.start;
          scope.curPage = page.currentPageNumber;
          scope.pageNumber = page.pageNumber;
        }
      }, true);

      // 审核
      scope.passReview = function (e, id, status) {
        var data = {
          salerId: id,
          appStatus: status
        }
        // zha: $emit释放一个叫disableSource的变量
        scope.$emit('passReview', event, data);
      }

      // 编辑
      scope.editAds = function (e, id) {
        // zha: $emit子作用域传到父作用域  传递event与data； editAds作为一个事件被传递到controller
        scope.$emit('editAds', event, {id: id}) //e.target.dataset.adsCode
      }

      // 停用-查看
      scope.viewSource = function (e, id) {
        scope.$emit('viewSource', event, {id: id})
      }
    }
    return defineObj;
  }

  review.directive('saDealerreview', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'reviewModel', reviewFn]);
})
