/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: 请求代理
 */
var fs = require('fs');
var u = require('util');
var request = require('request');

// 代理请求
function proxyAPI (req, res, route) {
  var timeout = route.requesttimeout;
  // process.stdout.write(u.inspect(req));
  if (route.proxy) {
    req.pipe(request[route.httpmethod](req.url, timeout=timeout)).pipe(res);
  } else {
    req.pipe(request[route.httpmethod](req.url, timeout=timeout)).pipe(res);
    // var STATUS_5xx = /^5\d{2}/i;
    // var STATUS_2xx = /^2\d{2}/i;
    // var STATUS_4xx = /^4\d{2}/i;
    // var timeout = route.requesttimeout;
    // // process.stdout.write(u.inspect(req));

    // if (route.proxy) {
    //   req.pipe(request[route.httpmethod](req.url, callback)).pipe(res);
    // } else {
    //   req.pipe(request[route.httpmethod](req.url, function (error, response, body) {
    //     var filter = {
    //       code: 200,
    //       localtime: +new Date
    //     };
    //     // 5** 错误
    //     if (STATUS_5xx.test(response.statusCode)) {
    //       // 5** filter
    //       filter.code = response.statusCode || 500;
    //       filter.error = response.body;
    //       response.body = filter;
    //     } else if (STATUS_2xx.test(response.statusCode)) {
    //       // 2** 暂不做处理
    //       filter.code = response.statusCode || 200;
    //       filter.data = response.body;
    //       body = filter;
    //     } else if (STATUS_4xx.test(response.statusCode)) {
    //       // 4** 不作处理返回正常错误
    //       filter.code = response.statusCode || 400;
    //       filter.error = response.body;
    //       response.body = filter;
    //     } else {

    //     }
    //   })).pipe(res);
    // }
  }
}

// view 请求
function proxyView (req, res, route) {
  // process.stdout.write(route.staticfile);
  res.render(route.staticfile);
}

// JSON 请求
function proxyJson (req, res, route) {
  fs.createReadStream(filepath, {
    flags: "r",
    encoding: null
  }).pipe(res);
}

// other 请求
function proxyOthers (req, res, route) {
  // TODO
}

/**
 * [proxyRequest description]
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} route [description]
 * @return {[type]}       [description]
 */
module.exports.proxyRequest = function (req, res, route) {
  var target = route.target;

  switch (target) {
    case 'api':
      proxyAPI(req, res, route);
      break;
    case 'view':
      proxyView(req, res, route);
      break;
    case 'json':
      proxyJson(req, res, route);
      break;
    case 'others':
      proxyOthers(req, res, route);
      break;
    default:
      throw new Error('request can not be allowed.');
  }
}