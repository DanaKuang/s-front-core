/**
 * Author: liubin
 * Create Date: 2017-06-29
 * Description: 扩展帮助工具
 */
define([], function() {
    var Helpers = angular.module('ngui.helpers', ['ngui.helpers.util', 'ngui.helpers.template']);
    var helpersUtil = angular.module('ngui.helpers.util', []);
    var helpersTemplate = angular.module('ngui.helpers.template', []);

    //功能函数集合
    helpersUtil.factory('util', function() {
        //把指定属性扩展到目标对象上
        var uiExtend = function(obj, obj2, arrkey) {
            var args = Array.prototype.slice.call(arguments),
                lastArg = args.pop(),
                target = args.shift(),
                objs = args;

            // if(!target) return;

            if (!angular.isArray(lastArg) || args.length == 0) {
                return angular.extend.apply(null, arguments);
            } else {
                angular.forEach(lastArg, function(key) {
                    var v, re = /true|false/i;
                    for (var len = objs.length, i = len - 1; i >= 0; i--) { //为每个key遍历对象数组
                        if (objs[i] && angular.isDefined(objs[i][key])) {
                            v = objs[i][key]; //获得目标值
                            break;
                        }
                    }
                    target[key] = angular.isDefined(v) ? v : target[key]; //目标值赋值给目标对象
                    if (angular.isDefined(v)) {
                        target[key] = v;
                        if ((typeof v === 'string') && re.test(v) && target.$eval) {
                            // if (!/\?link\=true/gi.test(unescape(v)))
                            target[key] = target.$eval(v);
                        }
                    }

                });
            }
            return target;
        };
        //获取元素在数组中的索引
        var indexOf = function(arr, v) {
            if ([].indexOf) {
                return arr.indexOf(v);
            } else {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] === v) {
                        return i;
                    }
                }
                return -1;
            }
        };
        // 保留满足条件的元素组成子数组
        var filter = function(arr, fn) {
            var r = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (fn(arr[i])) {
                    r.push(arr[i])
                }
            }
            return r;
        };
        // 映射为新数组
        var map = function(arr, fn) {
            var r = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                r.push(fn(arr[i], i));
            }
            return r;
        };
        var reduce = function(arr, fn) {
            var result = arr[0],
                i = 1;
            for (len = arr.length; i < len; i++) {
                result = fn(result, arr[i]);
            }
            return result;
        };
        // 为每个元素执行函数fn
        var each = function(arr, fn) {
            for (var i = 0, len = arr.length; i < len; i++) {
                fn(arr[i], i)
            }
        };
        // 判断是否有满足条件的元素
        var some = function(arr, fn) {
            var r = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (fn(arr[i], i)) {
                    return r = true;
                }
            }
            return r;
        };
        // 从对象挑选若干键值对 组成子对象
        var pickObj = function(obj, props) {
            var o = {};
            if (typeof props === 'string') {
                o[props] = obj[props];
                return o;
            }

            angular.forEach(props, function(prop) {
                o[prop] = obj[prop];
            });
            return o;
        };
        //元素去重
        var unique = function(arr) {
            var ret = [];
            angular.forEach(arr, function(e, i) {
                (indexOf(ret, e) < 0) && ret.push(e);
            });
            arr.splice(0, arr.length);
            arr.push.apply(arr, ret);
            return arr;
        };
        // 为每个key/value执行函数
        var eachkey = function(o, fn, arr) {
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    angular.isArray(arr) ? arr.push(fn(o[k], k)) : fn(o[k], k);
                }
            }
        };
        // 对象映射为数组
        var omap = function(o, fn) {
            var arr = [];
            eachkey(o, fn, arr);
            return arr;
        };

        return {
            uiExtend: uiExtend,
            each: each,
            indexOf: indexOf,
            filter: filter,
            map: map,
            reduce: reduce,
            some: some,
            pickObj: pickObj,
            unique: unique,
            eachkey: eachkey,
            omap: omap
        };
    });

    helpersTemplate.factory('fetchTemplate', ['$http', '$q', '$templateCache', function($http, $q, $templateCache) {
        return function(template) {
            // 从模板缓存($templateCache)获取模板或通过ajax请求模板并存入$templateCache，
            return $q.when($templateCache.get(template) || $http.get(template)).then(function(res) {
                if (angular.isObject(res)) {
                    $templateCache.put(template, res.data);
                    return res.data;
                } else {
                    return res;
                }
            });
        }
    }]);

    return [Helpers, helpersUtil, helpersTemplate];
});
