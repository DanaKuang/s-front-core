/**
 * Author: liubin
 * Create Date: 2017-07-04
 * Description: api
 */

define([], function () {
  // 格式化url
  var parseUrl = {
    ServiceType: 'factory',
    ServiceName: 'parseUrl',
    ServiceContent: ['util', function (util) {
      /**
       * 从url上去参数转化成对象
       * @param  {[type]} url [description]
       * @return {[type]}     [description]
       */
      function parseQuery (url) {
        var re = /(\w+)=([^\&]*)(?:\&|$)/g;
        var query = url.split('?');
        var len = query.length;
        var json = {};
        if (len < 2) {
          return json;
        }
        query = query[len - 1];
        query.replace(re, function (m, k, v) {
          if (v.toString().toLowerCase() === 'true') {
            v = true;
          }
          if (v.toString().toLowerCase() === 'false') {
            v = false;
          }
          json[k] = v;
          return m;
        });
        return json;
      }

      // 请求格式转化
      function parseUrl (url, datas) {
        var result = {
          method: 'post',
          url: url
        };
        var q;
        if (q = parseQuery(url)) {
          result.data = q;
        }
        // datas 非数组
        datas && (!angular.isArray(datas)) && (result.data = datas);
        var ret = [];
        ret.push(result);
        return ret;
      }
      return parseUrl;
    }]
  };

  // ajax请求
  var mAjax = {
    ServiceType: 'factory',
    ServiceName: 'mAjax',
    ServiceContent: ['$q', 'request', 'util', function ($q, request, util) {
      return function(configs, params) {
        var defers = [];
        angular.forEach(configs, function(conf, i) {
            var df = $q.defer();
            defers.push(df);
            if (conf.method.toLowerCase() == "post" && params) {
                conf.data = params;
            }
            if (conf.method.toLowerCase() == "post") {
                request.$Update(conf.url, conf.data, null, function(data, status, headers, config) {
                    if (status === 200) {
                        df.resolve(data);
                    } else {
                        df.reject(data);
                    }
                }, function(res, status, headers, config) {
                    df.reject(data);
                });
            } else {
                request.$Query(conf.url, conf.data, null, function(data, status, headers, config) {
                    if (status === 200) {
                        df.resolve(data);
                    } else {
                        df.reject(data);
                    }
                }, function(res, status, headers, config) {
                    df.reject(data);
                });

            }
        });
        var promises = util.map(defers, function(df) {
            return df.promise;
        });
        return $q.all(promises);
    }
    }]
  };
  return [parseUrl, mAjax];
});