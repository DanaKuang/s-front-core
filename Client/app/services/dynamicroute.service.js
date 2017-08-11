/**
 * Author: liubin
 * Create Date: 29017-06-29
 * Description: dynamicroute
 */

define([], function () {
  /**
   * 路由路径解析
   * @type {Object}
   */
  var pathRegExp = function(path, opts) {
      var insensitive = opts.caseInsensitiveMatch,
          ret = {
              originalPath: path,
              regexp: path
          },
          keys = ret.keys = [];

      path = path
          .replace(/([().])/g, '\\$1')
          .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
              var optional = option === '?' ? option : null;
              var star = option === '*' ? option : null;
              keys.push({
                  name: key,
                  optional: !!optional
              });
              slash = slash || '';
              return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
          })
          .replace(/([\/$\*])/g, '\\$1');

      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
  };
  /**
   * $DynamicRouteService动态路由服务
   * @type {Object}
   */
  var DynamicRouteService = {
      ServiceType: "service",
      ServiceName: "$dynamicRoute",
      ServiceContent: ['$templateCache', '$rootScope', '$location', '$route', '$log', 'authorization', function($templateCache, $rootScope, $location, $route, $log, authorization) {
          //加载遮罩层
          $rootScope.loadingMark = {
              hide: function() {
                  setTimeout(function() {
                      $('#_loadingIcon').hide();
                  }, 500);
              },
              show: function() {
                  $('#_loadingIcon').show();
              }
          };
          //监听浏览器地址栏地址变更，然后检测路由表，若路由不存在则动态注册路由
          $rootScope.$on('$locationChangeStart', function($event, newUrl, oldUrl) {
              // 监听地址栏变化，判断是否有权限
              authorization.check(
                  decodeURIComponent(newUrl),
                  function(url, path) {
                      $rootScope.$emit('$dynamicRouteChangeStart', path);
                  },
                  function() {
                      $event.preventDefault();
                      location.href = "/login";
                      console.log('页面没有授权...');
                  }
              );

          });
          //动态路由请求
          $rootScope.$on('$dynamicRouteChangeStart', function(evt, path) {
              if (path && !_.includes(_.keys($route.routes), path)) {
                  var route = {
                          templateUrl: path
                      },
                      redirectPath = (path[path.length - 1] == '/') ?
                      path.substr(0, path.length - 1) : path + '/';

                  $route.routes[path] = angular.extend({
                          reloadOnSearch: true
                      },
                      route,
                      path && pathRegExp(path, route)
                  );
                  $route.routes[redirectPath] = angular.extend({
                      redirectTo: path
                  }, pathRegExp(redirectPath, route));
              } else if (_.isEmpty(path) && sessionStorage.defaultPage) {
                  var url_menu = sessionStorage.defaultPage.split('?'),
                      url = url_menu[0],
                      menu = url_menu[1],
                      loc = $location.path(url);

                  if (!menu) return;

                  var key_value = menu.split('='),
                      key = key_value[0],
                      value = key_value[1];
                  loc.search(key, value);
              }
          });
          //监听路由开始解析事件，弹出加载提示信息
          $rootScope.$on('$routeChangeStart', function(evt, current, previous) {
              console.log('route change start.');
              // 清空定时器对象
              window.IntervalArr &&
              window.IntervalArr.forEach(function (int) {
                clearInterval(int);
                int = null;
              });
          });
          // 监听路由解析完成事件
          $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {
              console.log('route change success.');
          });
          //监听路由解析失败事件，隐藏加载提示信息
          $rootScope.$on('$routeChangeError', function(evt, current, previous, respone) {
              console.log('route change error.');
          });
          // 监听视图加载完成事件，隐藏加载提示信息
          $rootScope.$on('$viewContentLoaded', function(evt) {
              console.log('view content loaded.');
          });
      }]
  };
  return [DynamicRouteService];
});