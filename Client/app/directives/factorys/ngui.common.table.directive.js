/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: 通用表格
 * Directive: sa-table
 */

define([], function () {
  var nguicommontable = angular.module('ngui.common.table', []);

  // 创建表格
  function commonTableFn (util) {
    var defaults = { //默认配置
      tpl: '/common.table.tpl.html', // 模板
      caption: '',                   // 标题
      tableCls: 'table-bordered',    // table的class
      columns: [],                   // 字段数组
      rows: [],                      // 行数组
      sort: {},                      // 排序定义
      checkType: 'checkbox',         // 不选/多选/不选,
      allChecked: false,             // 是否全选
      headCls: '',                   // 注入thead>tr的class
      id: '',                        // 表格的id
      tblUrl: '',                    // 动态请求表格数据
      width: '100%',                 // 设置宽度
      isSortable: '',                // ng-sortable方法排序
      isHide: false,                 // 是否显示表格
      rowDetail: false,              // 子表格数据
    };
    var defineObj = {
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

    function linkFn(scope, ele, attrs) {
      // 标签属性的tblUrl设置优先 考虑同1分json多个地方共用
      var tblUrl = attrs.tblUrl || (scope.conf && scope.conf.tblUrl);

      util.uiExtend(scope, defaults, attrs, scope.conf || {}, ['tableCls', 'columns', 'rows', 'width', 'isAutoSize', 'isHide']);

      //conf整个改变 则更新模板的数据
      scope.$watch('conf', function() {
          util.uiExtend(scope, defaults, attrs, scope.conf, ['tableCls', 'columns', 'rows', 'width', 'isAutoSize', 'isHide']);
      });
    }
    return defineObj;
  }
  // 创建表格指令
  nguicommontable.directive('saCommonTable', ['util', commonTableFn]);
});