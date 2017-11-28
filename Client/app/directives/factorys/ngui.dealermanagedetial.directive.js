/**
 * Author: hanzha
 * Create Date: 2017-11-18
 * Description: 经销商管理，详情表格
 */

define([], function () {
  var manage = angular.module('ngui.dealermanagedetial', []);

  var manageFn = function ($rootScope, $http, $compile, $timeout, util, $model) {
    var defaults = { //默认配置
      tpl: '/dealermanagedetial.tpl.html',
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
        conf: '=', // =进行的是双向的数据绑定
        info: '='
      },
      controllerAs: 'vm',
      controller: function() {
        var vm = this;
        console.log(vm)
      },
      // zha: link函数主要用于操作dom元素,给dom元素绑定事件和监听.
      link: linkFn
    };

    //scope: 指令所在的作用域; element：指令元素的封装，可以调用angular封装的简装jq方法和属性; attrs：指令元素的属性的集合
    function linkFn (scope, element, attrs) {
      scope.currentPage = 'team';
      scope.sourceIsTeam = false;
      scope.vm.selectType = 0;
      scope.vm.selectName = 0;
      scope.vm.appStatus = 0;
      scope.vm.orderStatus = 0;


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

      scope.$watch('info', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list']);

      }, true);

      // 启用、禁止
      // scope.startManage = function (e, id, status) {
      //   var data = {
      //     salerId: id,
      //     accountStatus: status
      //   }
      //   // zha: $emit释放一个叫disableSource的变量
      //   scope.$emit('startManage', event, data);
      // }
      //

      // 导航点击
      scope.detialNav = function (e, type) {
        scope.$emit('detialNav', event, type)
      }

      // 排序
      scope.teamOrderBy = function (e, type) {
        scope.$emit('teamOrderBy', event, {orderBy: type})
      }

      // 返回列表
      scope.backList = function (e) {
        scope.$emit('backList', event)
      }

      // 佣金明细 - 佣金来源改变
      scope.sourceChage = function (e) {
        scope.$emit('sourceChage', event)
      }

      // 佣金明细 - search
      scope.detialSearch = function (e) {
        scope.$emit('detialSearch', event)
      }


    }
    return defineObj;
  }

  manage.directive('saDealermanagedetial', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'dealerManageModel', manageFn]);
})
