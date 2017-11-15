/**
 * Author: hanzha
 * Create Date: 2017-09-14
 * Description: 广告管理 表格
 */

// fixme: define作用，[]作用？？？
define([], function () {
  // zha: angular.module中第一个是模块的名称，第二个是依赖列表，也就是可以被依赖注入到模块中的对象列表；
  // 这里的ngui.adssource是什么规则？？？ 应该是个文件名
  var adssource = angular.module('ngui.adssource', []);

  // fixme: $compile, util这几个各自作用？？？
  // $http 是 AngularJS 中的一个核心服务，用于读取远程服务器的数据。
  // 所有的应用都有一个 $rootScope，它可以作用在 ng-app 指令包含的所有 HTML 元素中。
  var adssourceFn = function ($rootScope, $http, $compile, $timeout, util, $model) {
    var defaults = { //默认配置
      tpl: '/adssource.tpl.html',
      list: [],
      totalCount: 0,
      size: 0,
      curPage: 1,
      pageNumber: 1
    };

    var defineObj = { //指令定义对象
      restrict: 'AE',
      replace: true,
      templateUrl: function(tElement, tAttrs) { // fixme: tElement, tAttrs哪儿来的？？？
        return tAttrs.tpl || defaults.tpl;
      },
      // zha: conf？？？conf是调用指令标签的属性
      scope: {
        conf: '=' // =进行的是双向的数据绑定
      },
      // zha: link函数主要用于操作dom元素,给dom元素绑定事件和监听.
      link: linkFn
    };

    //scope: 指令所在的作用域
    //element：指令元素的封装，可以调用angular封装的简装jq方法和属性
    //attrs：指令元素的属性的集合
    function linkFn (scope, element, attrs) { // 这个$scope是directive的scope

      // fixme: util.uiExtend作用是？？？
      util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

      // 监视conf变化更新page，也就是监听adssourceConf，自定义指令的属性在指令的scope下。
      scope.$watch('conf', function () {
        // 属性赋值
        util.uiExtend(scope, defaults, attrs, (scope.conf || {}), ['list', 'totalCount', 'curPage', 'pageNumber']);

        // zha: 一开始进入页面的时候scope.conf是undefined  scope.conf什么时候被赋值了呢,下面是分页吗？？？conf是在directive的属性里设置的，是分页。
        if (scope.conf) {
          var data = scope.conf.data;
          var page = data.page;
          scope.list = data.list;
          scope.totalCount = page.count;
          scope.size = page.pageSize;
          scope.curPage = page.currentPageNumber;
          scope.pageNumber = page.pageNumber;
        }
      }, true);

      // 启用
      scope.startDisableSource = function (e, id, status) {
        var data = {
          id: id,
          status: status
        }
        // fixme: $emit释放一个叫startActivity的变量
        scope.$emit('startDisableSource', event, data);
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

  // fixme: 下面的数组是干嘛的呢，不应该第二个是方法吗？？？,  这些东西不引用就不能用了吗？？？
  adssource.directive('saAdssource', ['$rootScope', '$http', '$compile', '$timeout', 'util', 'adssourceModel', adssourceFn]);
})
