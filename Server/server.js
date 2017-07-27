/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: server 配置
 */

module.exports.start = function (plugins) {
  'use strict';
  var yamljs = require('yamljs');
  var client = process.cwd();
  var server = require(__dirname + '/controller/server');
  var config = yamljs.load(client + '/config/config.yml');

  config.def.apppath = client;
  config.def.apiroute = yamljs.load(client + '/config/config.api.yml');
  config.def.viewroute = yamljs.load(client + '/config/config.view.yml');

  server.init(config, plugins);
}