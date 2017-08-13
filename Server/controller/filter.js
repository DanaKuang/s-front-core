/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: filter
 *
 * 对于首页漏洞，这里先放个坑：
 * 在登陆成功拿到token后，跳转到首页；
 * 由于服务还没有加载，导致首页请求没有带token；
 * 首页的校验暂时不在这里做，放到地址栏的监听，；
 * 然后判断sessionStorage里是否有token；
 * 授权只检测是否🈶有token，并不能判断token的有效性。
 */
/**
 * [register description]
 * @param  {[type]} express [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */
module.exports.register = function (express, config) {
  var u = require('util');
  var router = express.Router();

  //首页和登录页路由
  router.get('/', function(req, res) {
      // process.stdout.write(u.inspect(req));

      if (true) {
          res.render(config.homepage);
      } else {
          res.render(config.loginpage);
      }
  });
  //首页和登录页路由
  router.get('/login', function(req, res) {
      res.render(config.loginpage);
  });
  //找回密码
  router.get('/find', function(req, res) {
      res.render(config.findpage);
  });
  return router;
}