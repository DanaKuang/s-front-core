/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: dataSvc
 * 数据转换
 */

define([], function () {
  var dataSvc = {
    ServiceType: 'factory',
    ServiceName: 'dataSvc',
    ServiceContent: ['', function () {
      var transData = {};

      // 转换表格数据
      transData.table = function(bdata, fdata, extendParam) {
          var data = [];
          if (bdata === undefined || bdata.response_params === undefined) {
              data = (!bdata || bdata.length === 0) ? [] : bdata;
          } else {
              data = bdata.response_params;
          }

          function setRows(bdata, fdata) {
              var rows = [];
              var columns = fdata.columns;
              var editable = fdata.editable;
              var lens = []; //保存每个字段 最大字符数
              var datas = bdata.data || bdata;
              var isSelectAll = false;
              var rid = fdata.rid;

              if (extendParam && extendParam.isSelectAll) {
                  isSelectAll = true;
              }
              util.each(datas, function(row, i) { //遍历处理 每条后端数据bdata
                  var nr = newRow(editable, row, columns, rid, i, isSelectAll);
                  rows.push(nr);
              });

              (function colAutoWidth(columns, lens, util) {
                  //列没设置width，则自动设置宽度 1个中文20px 最大10个中文
                  var tdMaxWords = 10; //单元格 最大显示字符数，超出则 ...,鼠标悬停 显示完整
                  var tdWordWidth = 14; //单元格内 每个中文预定宽度 20px;
                  var paddingLR = 8 * 2; //单元格左右有8px的padding, td {box-sizing:border-box}
                  var defaultWidth = 80;
                  util.each(columns, function(col, i) {
                      if (col.hide || col.width && col.width.toString().toLowerCase() === "auto") { //当表格宽度较大，列数较少时，添加auto类型宽度的单元格，用于承载多余的宽度
                          return;
                      }
                      //没有width时，自动计算宽度
                      col.width = col.width || Math.max(Math.min(tdMaxWords, Math.max(lens[i] || 0, col.label.length)) * tdWordWidth, defaultWidth) + paddingLR + 'px';
                  });
              })(fdata.columns, lens, util);

              function newRow(editable, row, columns, rid, i, isSelectAll) { //创建新行 {cells[],rid:..}
                  var r = {},
                      cells = [];
                  var special = {
                      disabled: {},
                      isHide: {}
                  };
                  util.each(columns, function(column, i) {
                      var cn = column.name;
                      var v = (row[cn] == 0) ? row[cn] : row[cn] || '';

                      if (editable && column.edit == "select") {
                          v = {
                              "value": v,
                              "label": ""
                          };
                      }
                      cells.push(v);
                      lens[i] = Math.max(cnLen(v), (lens[i] || 0)); //若较大 则更新
                      //对每一个单元格进行特殊处理
                      extendParam && extendParam.callback && (extendParam.callback(cn, row, special));
                  });
                  r.checked = isSelectAll,
                      r.cells = cells;
                  r.rid = row[rid];
                  if (r.rid === "" || r.rid == undefined) {
                      r.rid = ("newrow_" + Math.random()).replace(".", "");
                  }
                  r.special = special; //对每个单元格进行特殊处理，格式为 special.处理方法:{处理对象:true or false} 的格式，
                  r.sourceRow = row; //每一行数据的数据源
                  r.order = i; //排序顺序值
                  return r;
              }
              fdata.rid = rid; //哪个字段 唯一标识1行数据 rid->rowid
              var newRowArr = [];
              angular.forEach(fdata.rows, function(row, index) {
                  delete row.sn;
                  delete row.$$hashKey;
                  newRowArr.push(row);
              });
              if (extendParam && extendParam.ispush) { //新增一行
                  newRowArr = newRowArr.concat(rows);
                  fdata.rows = newRowArr;
              } else {
                  fdata.rows = rows;
              }
          }

          function setPaging(bdata, fdata) {
              var curPnum, totalSize, pageSize, paging;
              curPnum = bdata.pageIndex === undefined ? fdata.paging.curPnum : bdata.pageIndex;
              totalSize = bdata.resultCount === undefined ? fdata.paging.totalSize : bdata.resultCount;
              pageSize = bdata.pageSize === undefined ? fdata.paging.pageSize : bdata.pageSize;
              paging = {
                  curPnum: curPnum,
                  totalSize: totalSize,
                  pageSize: pageSize,
              };
              angular.extend(fdata.paging, paging);
          }

          try {
              setRows(data, fdata);
              setPaging(data, fdata);
          } catch (e) {
              console && console.log(e);
          }
          return fdata; //前后台数据合并
      };

    }]
  };

  return dataSvc;
});