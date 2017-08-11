/**
 *
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
   * $RouteParamsProvider提供器服务
   * @type {Object}
   */
  var RouteParamsProvider = {
      ServiceType: "provider",
      ServiceName: "$routeParams",
      ServiceContent: function() {
          this.$get = function() {
              return {};
          };
      }
  };

  /**
   * $RouteProvider提供器服务
   * @type {Object}
   */
  var RouteProvider = {
      ServiceType: "provider",
      ServiceName: "$route",
      ServiceContent: function() {
          var routes = {};

          var inherit = function(parent, extra) {
              return angular.extend(new(angular.extend(function() {}, {
                  prototype: parent
              }))(), extra);
          };

          this.when = function(path, route) {
              routes[path] = angular.extend({
                      reloadOnSearch: true
                  },
                  route,
                  path && pathRegExp(path, route)
              );
              // create redirection for trailing slashes
              if (path) {
                  var redirectPath = (path[path.length - 1] == '/') ? path.substr(0, path.length - 1) : path + '/';

                  routes[redirectPath] = angular.extend({
                          redirectTo: path
                      },
                      pathRegExp(redirectPath, route)
                  );
              }

              return this;
          };
          this.otherwise = function(params) {
              this.when(null, params);
              return this;
          };
          this.$get = [
              '$rootScope',
              '$location',
              '$routeParams',
              '$q',
              '$injector',
              '$http',
              '$templateCache',
              '$sce',
              function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {
                  var forceReload = false,
                      $route = {
                          routes: routes,
                          reload: function() {
                              forceReload = true;
                              $rootScope.$evalAsync(updateRoute);
                          }
                      };

                  var switchRouteMatcher = function(on, route) {
                      var keys = route.keys,
                          params = {};

                      if (!route.regexp)
                          return null;

                      var m = route.regexp.exec(on);
                      if (!m)
                          return null;

                      for (var i = 1, len = m.length; i < len; ++i) {
                          var key = keys[i - 1],
                              val = m[i];

                          if (key && val) {
                              params[key.name] = val;
                          }
                      }
                      return params;
                  };

                  var parseRoute = function() {
                      // Match a route
                      var params, match;
                      angular.forEach(routes, function(route, path) {
                          // var currentPath = $location.path().replace(/\?link\=true/g, ''); //针对领导首页和主管首页解决页面查询跳转字符串路由问题
                          if (!match && (params = switchRouteMatcher($location.path(), route))) {
                              match = inherit(route, {
                                  params: angular.extend({}, $location.search(), params),
                                  pathParams: params
                              });
                              match.$$route = route;
                          }
                      });
                      // No route matched; fallback to "otherwise" route
                      return match || routes[null] && inherit(routes[null], {
                          params: {},
                          pathParams: {}
                      });
                  };

                  var interpolate = function(string, params) {
                      var result = [];
                      angular.forEach((string || '').split(':'), function(segment, i) {
                          if (i === 0) {
                              result.push(segment);
                          } else {
                              var segmentMatch = segment.match(/(\w+)(.*)/);
                              var key = segmentMatch[1];
                              result.push(params[key]);
                              result.push(segmentMatch[2] || '');
                              delete params[key];
                          }
                      });
                      return result.join('');
                  };

                  var updateRoute = function() {
                      var next = parseRoute(),
                          last = $route.current;

                      if (next && last && next.$$route === last.$$route && angular.equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {
                          last.params = next.params;
                          angular.copy(last.params, $routeParams);
                          $rootScope.$broadcast('$routeUpdate', last);
                      } else if (next || last) {
                          forceReload = false;
                          $rootScope.$broadcast('$routeChangeStart', next, last);
                          $route.current = next;
                          if (next) {
                              if (next.redirectTo) {
                                  if (angular.isString(next.redirectTo)) {
                                      $location
                                          .path(interpolate(next.redirectTo, next.params))
                                          .search(next.params)
                                          .replace();
                                  } else {
                                      $location
                                          .url(
                                              next.redirectTo(
                                                  next.pathParams,
                                                  $location.path(),
                                                  $location.search()
                                              )
                                          )
                                          .replace();
                                  }
                              }
                          }

                          $q.when(next).then(function() {
                              if (next) {
                                  var locals = angular.extend({}, next.resolve),
                                      template, templateUrl;

                                  angular.forEach(locals, function(value, key) {
                                      locals[key] = angular.isString(value) ?
                                          $injector.get(value) : $injector.invoke(value);
                                  });

                                  if (angular.isDefined(template = next.template)) {
                                      if (angular.isFunction(template)) {
                                          template = template(next.params);
                                      }
                                  } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                                      if (angular.isFunction(templateUrl)) {
                                          templateUrl = templateUrl(next.params);
                                      }
                                      templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                                      if (angular.isDefined(templateUrl)) {
                                          next.loadedTemplateUrl = templateUrl;
                                          template = $http.get(templateUrl, {
                                              cache: $templateCache
                                          }).
                                          then(function(response) {
                                              return response.data;
                                          });
                                      }
                                  }
                                  if (angular.isDefined(template)) locals.$template = template;
                                  return $q.all(locals);
                              }
                          }).then(function(locals) { // after route change
                              if (next == $route.current) {
                                  if (next) {
                                      next.locals = locals;
                                      angular.copy(next.params, $routeParams);
                                  }
                                  $rootScope.$broadcast('$routeChangeSuccess', next, last);
                              }
                          }, function(error) {
                              if (next == $route.current) {
                                  $rootScope.$broadcast('$routeChangeError', next, last, error);
                              }
                          });
                      }
                  };
                  $rootScope.$on('$locationChangeSuccess', updateRoute);

                  return $route;
              }
          ];
      }
  };

  return [RouteParamsProvider, RouteProvider];
});