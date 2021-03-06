/**
 *
 */
define([], function () {
  var count = 0;
  var interceptor = {
      ServiceType: 'factory',
      ServiceName: 'httpInterceptor',
      ServiceContent: ['$injector', '$q', 'loadingProgress', function($injector, $q, lPro) {
          var clearSession = function () {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("access_loginId");
            location.href = '/login';
          }
          // 登出
          var weblogout = function() {
              var $http = $injector.get('$http');
              return $http({
                  url: '',
                  method: 'post',
                  headers: {
                      'token': sessionStorage.getItem('access_token') || "",
                      'loginId': sessionStorage.getItem('access_loginId') || ""
                  }
              });
          };
          return {
              request: function(config) {
                  if (!count++) {
                    lPro.show();
                  }
                  config.headers.client = location.host;
                  config.headers.domain = location.hostname;
                  config.headers.token = sessionStorage.getItem('access_token');
                  config.headers.loginId = sessionStorage.getItem('access_loginId');
                  config.requestTimestamp = +new Date;
                  return config;
              },
              response: function(response) {
                  if (!--count) {
                    lPro.hide();
                  }
                  response.config.responseTimestamp = +new Date;
                  return response;
              },
              requestError: function(rejectReason) {
                  return $q.reject(rejectReason);
              },
              responseError: function(response) {
                  if (!--count) {
                    lPro.hide();
                  }
                  switch (response.status) {
                      case 401:
                          return clearSession();
                  }
                  return response;
              }
          };
      }]
  };

  return [interceptor];
});