/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: route
 */
/**
 * [register description]
 * @param  {[type]} express [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */
module.exports.register = function (express, routes) {
  var u = require('util');
  var path = require('path');
  var router = express.Router();
  var proxy = require('./proxy');
  var mime = require('mime-types');

  function filter (route) {
    return route.enableroute;
  }


  /**
   * 请求处理分类
   * @param  {[type]} route [description]
   * [local json]
   * [view]
   * [api]
   * [others]
   */
  function match (route) {
    router[route.httpmethod](route.routepath, function(req, res) {
      var config = req.config;
      var apimatch = new RegExp(config.apiroot, 'i');
      var viewmatch = new RegExp(config.viewroot, 'i');
      var rootfilter = new RegExp(config.rootfilter, 'i');
      var baseURL = 'http://'; //
      baseURL += config.gateway.host; // 请求ip
      baseURL += ':';
      baseURL += config.gateway.port; // 请求端口号

      route.proxy = false;
      // 去掉url后带的参数
      route.url = req.url.split('?')[0];
      // 请求文件类型
      route.extname = path.extname(req.url).split('?')[0];
      // 请求超时
      route.requesttimeout = config.requesttimeout || 6000;

      // 这里会去判断是否已授权
      route.authorized = !!config.token || !!req.headers.token;

      // 先判断是否已授权，没有则跳转login
      if (!route.authorized) {
        res.render(config.loginpage);
      }

      /**
       * 分类处理
       * @param  {[type]}[description]
       */
      // process.stdout.write('path: '+JSON.stringify(route)+ '|\n');

      if (viewmatch.test(route.routepath)) { // view处理
        route.target = 'view';
      } else if (route.extname === '.json') {
        route.target = 'json';
      } else if (apimatch.test(route.routepath)) { // api处理
        route.target = 'api';
        if (!!config.rootfilter) {
          route.routepath = route.routepath.replace(rootfilter, '');
        }
        req.url = baseURL + route.routepath.replace(apimatch, '');
      } else {
        route.target = 'others';
      }
      // 所有请求统一放到proxy中处理，根据target判断
      proxy.proxyRequest(req, res, route);
    });
  }

  if (!Array.isArray(routes)) {
    routes = [routes];
  }
  routes.filter(filter).forEach(match);
  // process.stdout.write(JSON.stringify(routes));

  return router;
}