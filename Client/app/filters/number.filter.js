/**
 * Author: Kuang
 * Create Date: 2017-08-23
 * Description: 数字
 */

define([], function () {
	// 均不可输入负数，前面不可为0
 	// 非负可输入小数
  var decimalFormat = {
      ServiceType: "factory",
      ServiceName: "decimalFormat",
      ServiceContent: ['$filter', function ($filter) {
      	function decimalnumber () {
      		var $target = $(event.target);
      		var numReg =  /^[1-9]{1,}.\d{1,}$|^0.\d{1,}$|^\d+/;　//匹配正整数和浮点数
      		var val = $target.val();
	        if (numReg.test(val)) {
	          if (val) {
	            if (val < 0) {
	              event.target.value = 0;
	            } else {
	              event.target.value = parseFloat(val);
	            }
	          }
	        } else {
	            event.target.value = ''
	        }
      	}

      	return {
      		decimalnumber: decimalnumber
      	}
      }]
  }

  // 整数
  var numberFormat = {
  	ServiceType: "factory",
    ServiceName: "numberFormat",
    ServiceContent: ['$filter', function ($filter) {
    	// 1. 非负整数； 2. 正整数
    	function notminusnotzero () {
    		var $target = $(event.target);
    		var numReg = /^\d+$/;
        var val = $target.val();
        if (numReg.test(val)) {
          if (val) {
            if (val < 0) {
              event.target.value = 0
            } else {
              event.target.value = Number(deletezero(val));
            }
          }
        } else {
            event.target.value = ''
        }
    	}

      return {
      	notminusnotzero: notminusnotzero
      };
    }]
  }

	function deletezero(str) {
	  if (str.length > 1) {
	    if (str[0] === '0') {
	      str = str.substr(1);
	      deletezero(str)
	    } else {
	      return str
	    }
	  } else {
	    return str
	  }
	}

  return [decimalFormat, numberFormat];
});