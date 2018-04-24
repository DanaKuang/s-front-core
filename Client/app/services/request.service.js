/**
 * Author: liubin
 * Create Date: 2017-06-30
 * Description: 对$http请求的封装
 * 统一前端请求
 * ****************************
 * 解答：why
 * jQuery的ajax      请求默认content-type: application/x-www-form-urlencoded
 * Angular的$http服务 请求默认content-type: text/plain;charset=UTF-8
 *
 * 使用$http服务 headers中content-type设置为jQuery默认类型
 * 必须将发送参数 改为a=1&b=2&c=3 否则后端接受不到 因为：
 * jQuery中发送到服务器的数据会自动转换成类似 a=1&b=2&c=3
 */
define([], function () {
    var request = {
        ServiceType: 'factory',
        ServiceName: 'request',
        ServiceContent: ['$http', 'authorization', function($http, authorization) {
            function httpRequest(method) {
                return function(url, data, def, success, fail) {
                    var defHeaders = {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    };
                    var option = {
                        method: method,
                        url: url,
                        headers: {
                            token: sessionStorage.getItem('access_token') || "",
                            loginId: sessionStorage.getItem('access_loginId') || ""
                        }
                    };
                    if (!def) {
                        option.headers = defHeaders;

                        // why ? 个
                        if (method !== 'get' && !!data) {
                            var r = [];
                            for (var d in data) {
                                r.push(d+'='+data[d]);
                            }
                            option.data = r.join('&');
                        }
                    } else {
                        option.data = data;
                        option.headers = angular.extend(option.headers, def);
                    }

                    return $http(option)
                            .success(success || function() {})
                            .error(fail || function() {})
                            .then(function(res) {
                                var code = res.data || {};
                                switch (code.ret) {
                                    case '100405':
                                        authorization.logout();
                                        break;
                                    case '100408':
                                        alert(code.message || "此帐号已在其他地方登录，您已被迫下线！");
                                        authorization.logout();
                                        break;
                                    case '100409':
                                        alert(code.message || "密码时限超出，请修改密码！");
                                        authorization.changepwd();
                                        break;
                                }
                                return res;
                            });
                };
            }

            return {
                $Query: httpRequest('get'),
                $Search: httpRequest('post'),
                $Create: httpRequest('post'),
                $Update: httpRequest('post'),
                $Delete: httpRequest('post'),
                $Redirect: httpRequest('get')
            };
        }]
    };

    return [request];
});