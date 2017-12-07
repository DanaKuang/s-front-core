/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商管理
 */

define([], function () {
  var manage = angular.module('ngui.dealermanage', []);

  var manageFn = function ($rootScope, $http, $compile, $timeout, util, $model) {
    var defaults = { //默认配置
      tpl: '/dealermanage.tpl.html',
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
      scope: {
        conf: '=' // =进行的是双向的数据绑定
      },
      link: linkFn
    };

    //scope: 指令所在的作用域; element：指令元素的封装，可以调用angular封装的简装jq方法和属性; attrs：指令元素的属性的集合
    function linkFn (scope, element, attrs) {
      // fixme: util.uiExtend作用是？？？
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

      // 监视conf变化更新page，也就是监听manageConf，自定义指令的属性在指令的scope下。
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

      // 启用、禁止
      scope.startManage = function (e, id, status) {
        var data = {
          salerId: id,
          accountStatus: status
        }
        // zha: $emit释放一个叫disableSource的变量
        scope.$emit('startManage', event, data);
      }

      // 排序
      scope.orderBy = function (e, type) {
        scope.$emit('orderBy', event, {orderBy: type})
      }

      // 查看详情
      scope.viewManage = function (e, id) {
        scope.$emit('viewManage', event, {salerId: id})
      }

    }
    return defineObj;
  }

  manage.directive('saDealermanage', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'dealerManageModel', manageFn]);
})
