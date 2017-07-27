/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: server
 */

var fs = require('fs');
var u = require('util');
var ejs = require('ejs');
var path = require('path');
var _ = require('underscore');
var log4js = require('log4js');
var logger = require('morgan');
var routers = require('./route');
var express = require('express');
var filters = require('./filter');
var colors = require('colors/safe');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

// 实例化
var app = express();

/**
 * [mergeRoute description]
 * @param  {[type]} routes [description]
 * @return {[type]}        [description]
 */
function mergeRoute (routes) {
  var routeArr = [];

  Object.keys(routes).forEach(function(key) {
      if (Array.isArray(routes[key])) {
          routes[key].forEach(function(cur) {
              routeArr.push(cur);
          });
      } else {
          routeArr.push(routes[key]);
      }
  });
  return routeArr;
}


/**
 * [setEnv description]
 * @param {[type]} config [description]
 */
function setEnv (options) {
  var def = options.def;
  var dev = options[def.runmode];
  var config = Object.keys(dev).reduce(function(set, key) {
        set[key] = dev[key];
        return set;
      }, def);

  config.viewroute = mergeRoute(config.viewroute);
  config.apiroute = mergeRoute(config.apiroute);
  config.homepage = path.join(config.apppath, config.homepage);
  config.loginpage = path.join(config.apppath, config.loginpage);
  config.viewpath = path.join(config.apppath, config.viewpath);
  config.favicon = path.join(config.apppath, config.favicon);
  config.log4js.filename = config.log4js.logpath + '/' + config.log4js.logfile;
  config.log4js.logpath = path.join(config.apppath, config.log4js.logpath);
  config.routes = Array.prototype.concat(config.apiroute, config.viewroute);

  return config;
}

/**
 * [usePlugins description]
 * @param  {[type]} app     [description]
 * @param  {[type]} plugins [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */
function usePlugins (app, plugins, config) {
  if (!plugins) {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    plugins.foreach(function (func) {
      app.use(func(config));
    });
  }
}

/**
 * [setLogger description]
 * @param {[type]} options [description]
 */
function setLogger (options) {
  //配置日志管理器文
  if (!fs.existsSync(options.log4js.logpath)) {
      fs.mkdirSync(options.log4js.logpath, 0777); //默认值0777
  }
  log4js.configure({
      appenders: [{
          type: 'console' //控制台输出
      }, {
          type: options.log4js.type, //文件输出
          filename: options.log4js.filename,
          pattern: options.log4js.pattern,
          alwaysIncludePattern: true,
          category: options.log4js.logpath
      }]
  });
  var log4 = log4js.getLogger(options.log4js.logpath);
  log4.setLevel(options.log4js.level);
  return log4;
}

function startServer (options) {
  var serverURL = 'http://' + app.get('host') + ':' + app.get('port');

  app.listen(app.get('port'));
  process.stdout.write(colors.green.underline('server run at: %s', serverURL));
  process.stdout.write('\n');
  if (options.openBrowser) {
      options.openBrowser(serverURL);
  }
}

/**
 * [init description]
 * @param  {[type]} config  [description]
 * @param  {[type]} plugins [description]
 * @return {[type]}         [description]
 */
module.exports.init = function (config, plugins) {
  config = setEnv(config);   // 设置环境变量
  usePlugins(app, plugins, config);  //使用中间件

  //设置环境变量
  app.set('env', config.runmode);
  app.set('favicon', config.favicon);
  app.set('port', process.env.PORT || config.server.port);
  app.set('host', process.env.HOST || config.server.host);
  app.set('views', config.viewpath);
  app.set('view cache', config.viewcache);
  app.set('view engine', config.viewengine);
  app.set('etag', config.etag);
  app.engine('html', ejs.renderFile);

  //异常提醒
  if (config.showerror) {
    app.use(errorHandler());
  }

  //开发环境打印日志
  if (config.runmode === 'dev') {
    app.use(logger('dev'));
  }

  app.use(favicon(config.favicon));

  //override
  app.use(methodOverride());

  var log4 = setLogger(config);

  //静态资源请求URL解析
  app.use(function(req, res, next) {
    var paths = _.pluck(config.staticpath, "path");
    paths.push(config.staticroot);
    paths = _.sortBy(paths, function(item) {
        return item.length;
    });
    paths.reverse();
    paths = _.map(paths, function(p) {
        return String.prototype.concat(p.replace(/\/$/, ''), "/");
    });
    paths.forEach(function(path) {
        var match = new RegExp(path, 'i');
        req.url = req.url.replace(match, '');
    });
    req.url = String.prototype.concat("/", req.url.replace(/^\//, ''));
    next();
  });

  //请求对象封装
  app.use(function(req, res, next) {
    req.app = app;
    req.config = config;
    req.homepage = config.homepage;
    req.loginpage = config.loginpage;
    // 根据token授权
    req.authorized = !!req.headers.token;// || !!req.cookies.token;
    next();
  });

  //设置静态文件路径
  config.staticpath.forEach(function(o, i, a) {
    app.use(express.static(path.join(config.apppath, o.path)));
  });

  //过滤器注册
  app.use(filters.register(express, config));
  //路由器注册
  app.use(routers.register(express, config.routes));
  //启动服务器
  startServer(app, config);
  //全局异常捕获处理
  process.on('uncaughtException', function(err) {
      log4.error((new Date()).toLocaleString() + ' uncaughtException:', err.message);
      log4.error(err.stack);
  });
}
