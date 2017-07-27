/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: kpi模块table特殊
 * Directive: sa-kpi-table
 */

define([], function () {
  var nguikpitbl = angular.module('ngui.kpi.table', []);

  // 创建表格
  function kpiTableFn ($rootScope, $compile, util, parseUrl, request, mAjax, formatFilter, createTblEdit, fetchTemplate) {
    var defaults = { //默认配置
      tpl: '/table.kpi.tpl.html', // 模板
      caption: '',                // 标题
      tableCls: 'table-bordered', // table的class
      columns: [],                // 字段数组
      rows: [],                   // 行数组
      childData: [],              // 子表格
      sort: {},                   // 排序定义
      checkType: 'checkbox',      // 不选/多选/不选,
      allChecked: false,          // 是否全选
      headCls: '',                // 注入thead>tr的class
      id: '',                     // 表格的id
      tblUrl: '',                 // 动态请求表格数据
      width: '100%',              // 设置宽度
      isSortable: '',             // ng-sortable方法排序
      isHide: false,              // 是否显示表格
      rowDetail: false,           // 子表格数据
    };
    var defineObj = { //指令定义对象
        restrict: 'AE',
        replace: true,
        template: '<div class="ui-table" ng-hide="isHide"></div>',
        scope: {
            conf: '='
        },
        compile: function(tEle, tAttr) {
            return linkFn;
        }
    };

    function linkFn(scope, ele, attrs) {
        // 标签属性的tblUrl设置优先 考虑同1分json多个地方共用
        var tblUrl = attrs.tblUrl || (scope.conf && scope.conf.tblUrl);

        util.uiExtend(scope, defaults, attrs, scope.conf || {}, ['isAutoSize']);

        // 监听渲染完成
        scope.$on('renderOK', function() {
            scope.hasrenderOK = true;
            console.log("renderOK...");
        });
        //需要请求数据模型
        createTblEdit(scope, ele, attrs, defaults);
        // 监听updateTable事件 排序
        scope.$on('updateTable', function(evt, opt) {
            createTblEdit(scope, ele, attrs, defaults);
        });

        // 更新表格数据
        function updateTable (conf) {
          var tblUrl = scope.paging.api || "";
          angular.extend({key:''}, conf);
          var mConf = parseUrl(tblUrl, conf)
          mAjax(mConf).then(function(data) {
              var fdata = scope.conf,
                  bdata = data[0] || [];
              fdata.byAjax = true;
              if (!bdata) {
                  bdata = [];
              }
              if (conf.sortBy === 'desc') {
                bdata.reverse();
              }
              scope.conf.rows = bdata;
              createTblEdit(scope, ele, attrs, defaults); //创建表格
          });
        }

        // 排序
        scope.sortTable = function ($event, head) {
          var sortId = head.name;
          var columns = scope.columns || [];
          scope.active = !scope.active;
          _.each(columns, function (col, idx) {
            if (sortId === col.name) {
              scope.sortId = idx;
            }
          });
          updateTable({key:sortId,sortBy:scope.active?'asc':'desc'});
        };

        // 打开子表
        scope.openCity = function (event, city, index) {
          if (!city) {
            console.log('未知城市');
            return false;
          }
          var childUrl = scope.childUrl || scope.initConf.childUrl || "";
          if (!childUrl) {
            console.log("未配置子表格请求api");
            return;
          }
          // 查找父行
          var $i = $(event.target);
          var $tbody = $i.closest('tbody');
          var $region = $tbody.find('.ui-kpi-ragion');
          var region_len = Number($region.attr('rowspan') || 0);
          var $child = $tbody.find(".ui-child-city-"+city);
          if ($i.hasClass('open')) {
            $i.removeClass('open');
            region_len -= $child.length;
            $region.attr('rowspan', region_len);
            $child.remove();
            return;
          } else {
            $i.addClass('open');
          }
          var ele = $i.closest('tr');
          var mConf = parseUrl(childUrl, {'provName': city});
          mAjax(mConf).then(function (data) {
            var childArr = [];
            _.each(data[0], function (d) {
              var tr = '<tr class="ui-child-city-'+city+'">';
              tr += '<td>'+d.city+'</td>';
              tr += '<td>'+d.saleType+'</td>';
              tr += '<td>'+d.scantimes+'</td>';
              tr += '<td>'+d.scanUsers+'</td>';
              tr += '<td>'+d.scanCodes+'</td>';
              tr += '</tr>';
              childArr.push(tr);
            });
            region_len += childArr.length;
            $region.attr('rowspan', region_len);
            ele.after(childArr.join(''));
          });
        };

        //conf整个改变 则更新模板的数据
        scope.$watch('conf', function() {
            util.uiExtend(scope, defaults, attrs, scope.conf, ['tableCls', 'columns', 'rows', 'paging', 'srhFormId', 'rid', 'width', 'isAutoSize', 'isSortable', 'isHide', 'rowDetail']);
        });
        scope.initConf = angular.copy(scope.conf);
    }
    return defineObj;
  }

  // 创建表格
  function createTblEditFn ($compile, util, fetchTemplate) {
    function createTbl(scope, ele, attrs, defaults) {
      // 往scope填充数据
      util.uiExtend(scope, defaults, attrs, scope.conf, ['tableCls', 'columns', 'rows', 'paging', 'srhFormId', 'rid', 'width', 'isAutoSize', 'isSortable', 'isHide', 'rowDetail']);

      var rows = scope.rows;
      var columns = scope.columns;
      var sort = scope.sort || {};

      // sort的数据 加入paging
      if (scope.paging) {
          scope.paging.sortname = sort.column; //排序字段 同步到paging
          scope.paging.sortorder = sort.down ? 'desc' : 'asc'; //排序顺序 同步到paging
      }

      //获取模板 并编译
      var tblTpl = attrs.tpl || defaults.tpl;
      fetchTemplate(tblTpl).then(function(tpl) {
          //编译模板并链接和插入dom中
          ele.html($compile(tpl)(scope));
      });
    }

    return createTbl;
  }

  // 创建表格服务
  nguikpitbl.factory('createTblEdit', ['$compile', 'util', 'fetchTemplate', createTblEditFn]);

  // 创建表格指令
  nguikpitbl.directive('saKpiTable', ['$rootScope', '$compile', 'util', 'parseUrl', 'request', 'mAjax', 'formatFilter', 'createTblEdit', 'fetchTemplate', kpiTableFn]);
});