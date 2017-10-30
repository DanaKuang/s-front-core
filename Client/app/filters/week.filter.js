/**
 * Author: Kuang
 * Create Date: 2017-10-26
 * Description: 每年每周传值处理
 */

define([], function () {
  var weekFilter = {
    ServiceType: "filter",
    ServiceName: "weekFilter",
    ServiceContent: function () {
      var $injector = angular.injector(["ng"]);
      var $filter = $injector.get('$filter');

      var weekfilter = function (val) {
        console.log(val);
      }

      return {
        weekfilter: weekfilter
      }
    }
  };

  return [weekFilter]
});