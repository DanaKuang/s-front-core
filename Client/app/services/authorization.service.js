/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: authorization
 */

define([], function () {
  var authorization = {
    ServiceType: "service",
    ServiceName: "authorization",
    ServiceContent: ['$http', function ($http) {

      // 入口函数
      this.done = function () {
        console.log('authorization....');
        angular
          .bootstrap(document, ['tztx.saas'])
          .invoke(['mark', function(mark) {
            // 加载动画
            mark.hide();
          }]);
      };
      //URL访问权限核查
      this.check = function(url, success, fail) {
        var path = url.split('#')[1] || '';
        var uncheck = !!sessionStorage.getItem('access_token');

        // 判断是否有session
        if (uncheck) {
            success && success(url, path);
            return true;
        } else {
            fail && fail(url, path);
            return false;
        }

      };
      // 跳转到登陆
      this.logout = function (active) {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('access_loginId');
        if (active) {
          $http.post('/api/tztx/saas/admin/login/logout').then(function () {
            location.href = "/login";
          });
        } else {
          location.href = "/login";
        }
      }
      // 跳转到修改密码
      this.changepwd = function () {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('access_loginId');
        location.href = "/find";
      }
    }]
  };

  return [authorization];
});