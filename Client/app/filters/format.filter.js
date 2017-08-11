/**
 * Author: liubin
 * Create Date: 2017-07-05
 * Description: 数据格式化
 */

define([], function () {
  var formatFilter = {
    ServiceType: "provider",
    ServiceName: "formatFilter",
    ServiceContent: function () {
      var $injector = angular.injector(["ng"]);
      var $filter = $injector.get('$filter');

      // 销区表格
      function salesTable (data) {
        var result = [];
        var typeArr = _.groupBy(data, 'saleType'); // 按照销区分类
        var typeKey = _.keys(typeArr);

        _.each(typeKey, function (type) {
          var arr = {'saleType': '', 'data':'', 'sum':''};
          var sum = {'scantimes':0,'scanUsers':0,'scanCodes':0};
          sum.scantimes = _.sum(typeArr[type], 'scantimes');
          sum.scanUsers = _.sum(typeArr[type], 'scanUsers');
          sum.scanCodes = _.sum(typeArr[type], 'scanCodes');
          arr.saleType = type;
          arr.data = typeArr[type];
          arr.sum = sum;
          result.push(arr);
        });

        return result;
      }

      // 规格表格
      function formatTable (data) {
        var result = [];
        var typeArr = _.groupBy(data, 'brand'); // 按照规格
        var typeKey = _.keys(typeArr);

        _.each(typeKey, function (type) {
          var arr = {'brand': '', 'data':'', 'sum':''};
          var sum = {'scantimes':0,'scanUsers':0,'scanCodes':0,'drawTimes':0};
          sum.scantimes = _.sum(typeArr[type], 'scantimes');
          sum.scanUsers = _.sum(typeArr[type], 'scanUsers');
          sum.scanCodes = _.sum(typeArr[type], 'scanCodes');
          sum.drawTimes = _.sum(typeArr[type], 'drawTimes');
          arr.specType = type;
          arr.data = typeArr[type];
          arr.sum = sum;
          result.push(arr);
        });

        return result;
      }

      // 销区与规格
      function sfTable (data) {
        var result = [];
        var typeArr = _.groupBy(data, 'productName');
        var typeKey = _.keys(typeArr);

        _.each(typeKey, function (key) {
          var obj = {};
          _.each(typeArr[key], function (arr) {
            obj[arr.saleZone+'_scanFirstTime'] = $filter("date")(arr.scanFirstTime, 'yyyy-MM-dd HH:mm:ss');
            obj[arr.saleZone+'_orderFirstTime'] = $filter("date")(arr.orderFirstTime, 'yyyy-MM-dd HH:mm:ss');
          });
          obj.productName = key;
          result.push(obj);
        });

        return result;
      }

      this.$get = function () {
        return {
          __filter__: $filter,
          salesTable: salesTable,
          formatTable: formatTable,
          sfTable: sfTable
        }
      }
    }
  };

  var dateFormatFilter = {
    ServiceType: "factory",
    ServiceName: "dateFormatFilter",
    ServiceContent: ['$filter', function($filter) {
      // 日期显示汉化
      $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
      };
      return angular.extend(dateFormat, {
        __filter__: $filter
      });
    }]
  };

  // dateFormat
  var dateFormat = {
    datetime: function(value) {
      return this.__filter__("date")(value, 'yyyy-MM-dd HH:mm:ss');
    },
    date: function(value) {
      return this.__filter__("date")(value, 'yyyy-MM-dd');
    },
    year_month: function(value) {
      return this.__filter__("date")(value, 'yyyy-MM');
    },
    year: function(value) {
      return this.__filter__("date")(value, 'yyyy');
    },
    month: function(value) {
      return this.__filter__("date")(value, 'MM');
    },
    hours_minute: function(value) {
      return this.__filter__("date")(value, 'HH:mm');
    }
  };


  return [formatFilter, dateFormatFilter]
});