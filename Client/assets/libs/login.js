/**
 * login
 * @return {[type]} [description]
 */
(function ($) {

  // login对象
  var login = {
    particles: [],
    max_particles: 1000,
    version: '1.0.0'
  };

  // 登陆初始化动画
  login.initCanvas = function () {
    if ($('body').find('canvas').length) {
      return this;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var tela = document.createElement('canvas');
    tela.width = $(window).width();
    tela.height = $(window).height();
    $("body").append(tela);
    window.onresize = function () {
      var cT = setTimeout(function () {
        $("canvas")[0].width = $(window).width();
        $("canvas")[0].height = $(window).height();
      }, 100);
    };

    var canvas = tela.getContext('2d');

    var Particle = function () {
      function Particle(canvas, progress) {
        _classCallCheck(this, Particle);

        var random = Math.random();
        this.progress = 0;
        this.canvas = canvas;

        this.x = $(window).width() / 2 + (Math.random() * 200 - Math.random() * 200);
        this.y = $(window).height() / 2 + (Math.random() * 200 - Math.random() * 200);

        this.w = $(window).width();
        this.h = $(window).height();
        this.radius = random > .2 ? Math.random() * 1 : Math.random() * 3;
        this.color = random > .2 ? "#6eecff" : "#313c1c";
        this.radius = random > .8 ? Math.random() * 2 : this.radius;
        this.color = random > .8 ? "#446cff" : this.color;

        // this.color  = random > .1 ? "#ffae00" : "#f0ff00" // Alien
        this.variantx1 = Math.random() * 300;
        this.variantx2 = Math.random() * 400;
        this.varianty1 = Math.random() * 100;
        this.varianty2 = Math.random() * 120;
      }

      Particle.prototype.render = function render() {
        this.canvas.beginPath();
        this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.canvas.lineWidth = 2;
        this.canvas.fillStyle = this.color;
        this.canvas.fill();
        this.canvas.closePath();
      };

      Particle.prototype.move = function move() {
        // this.x += (Math.sin(this.progress/this.variantx1)*Math.cos(this.progress/this.variantx2));
        // this.y += (Math.sin(this.progress/this.varianty1)*Math.cos(this.progress/this.varianty2));
        this.x += Math.sin(this.progress / this.variantx1) * Math.cos(this.progress / this.variantx2);
        this.y += Math.cos(this.progress / this.varianty2);

        if (this.x < 0 || this.x > this.w - this.radius) {
          return false;
        }

        if (this.y < 0 || this.y > this.h - this.radius) {
          return false;
        }
        this.render();
        this.progress++;
        return true;
      };

      return Particle;
    }();

    login.particles = [];
    var init_num = popolate(login.max_particles);

    function popolate(num) {
      for (var i = 0; i < num; i++) {
        setTimeout(function () {
          login.particles.push(new Particle(canvas, i));
        }.bind(this), i * 20);
      }
      return login.particles.length;
    }

    function clear() {
      canvas.globalAlpha = 0.05;
      canvas.fillStyle = '#1a1b38';
      canvas.fillRect(0, 0, tela.width, tela.height);
      canvas.globalAlpha = 1;
    }

    function update() {
      login.particles = login.particles.filter(function (p) {
        return p.move();
      });
      if (login.particles.length < init_num) {
        popolate(1);
      }
      clear();
      requestAnimationFrame(update.bind(this));
    }
    update();
    return this;
  }
  // 初始化登陆页
  login.init = function() {
    console.log('login init...');
    var $name = $('[name="username"]');
    var $word = $('[name="password"]');
    var $code = $('[name="code"]');
    var $remm = $('[name="remmber"]');
    var $logi = $('[name="login"]');

    // 退出清空session记录
    sessionStorage.removeItem('menuIdx');
    sessionStorage.removeItem('hash');
    // 绑定事件及初始化
    $name.val(localStorage.getItem('username') || "");
    $word.val("");
    $code.val("");
    $remm[0].checked = false;
    $logi.off();
    $remm.off();


    // 勾选是否保存用户名
    $remm.click(function (e) {
      var isC = this.checked;
      if (isC) {
        localStorage.setItem('username', $name.val());
      } else {
        localStorage.removeItem('username');
      }
    });

    // 登陆
    $logi.click(function (e) {
      var postData = {};
      postData.account = $name.val() || "";
      postData.pwd = $word.val() || "";
      // postData.code = $code.val() || "";

      if (!postData.account) {
        alert('用户名不能为空!');
        return;
      }
      if (!postData.pwd) {
        alert('用户密码不能为空!');
        return;
      }
      // md5加密
      // postData.pwd = $.md5(postData.pwd);

      // if (!postData.code) {
      //   alert('验证码不能为空!');
      //   return;
      // }
      // ajax
      $.ajax({
        url: '/api/tztx/saas/admin/login/verification',
        method: 'post',
        data: postData,
        success: function (res) {
          console.log(res);
          if (res.message == 'success') {
            var data = res.data || {};
            sessionStorage.setItem('access_token', data.token);
            sessionStorage.setItem('access_loginId', data.loginId);
            location.href = "/";
          } else {
            alert(res.message);
          }
        }
      });
    });
    return this;
  };
  // 初始化滑块验证
  login.drag = function (callback) {
    var $d = $("#drag");
    var x, isMove = false, defaults = {};
        var options = $.extend(defaults, options);
        //添加背景，文字，滑块
        var html = '<div class="drag_bg"></div>'+
            '<div class="drag_text" onselectstart="return false;" unselectable="on">拖动滑块验证</div>'+
            '<div class="handler handler_bg"></div>';
        $d.append(html);

        var handler = $d.find('.handler');
        var drag_bg = $d.find('.drag_bg');
        var text = $d.find('.drag_text');
        var maxWidth = $d.width() - handler.width();  //能滑动的最大间距

        //鼠标按下时候的x轴的位置
        handler.on('touchstart', function(e){
            isMove = true;
            x = e.targetTouches[0].pageX - parseInt(handler.css('left'), 10);
        });

        //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
        $(document).on('touchmove', function(e){
            var _x = e.targetTouches[0].pageX - x;
            if(isMove){
                if(_x > 0 && _x <= maxWidth){
                    handler.css({'left': _x});
                    drag_bg.css({'width': _x});
                }else if(_x > maxWidth){  //鼠标指针移动距离达到最大时清空事件
                    dragOk();
                }
            }
        }).on('touchend', function(e){
            isMove = false;
            var _x = e.changedTouches[0].pageX - x;
            if(_x < maxWidth){ //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                handler.css({'left': 0});
                drag_bg.css({'width': 0});
            }
        });

        //鼠标按下时候的x轴的位置
        handler.mousedown(function(e){
            isMove = true;
            x = e.pageX  - parseInt(handler.css('left'), 10);
        });

        //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
        $(document).mousemove(function(e){
            var _x = e.pageX - x;
            if(isMove){
                if(_x > 0 && _x <= maxWidth){
                    handler.css({'left': _x});
                    drag_bg.css({'width': _x});
                }else if(_x > maxWidth){  //鼠标指针移动距离达到最大时清空事件
                    dragOk();
                }
            }
        }).mouseup(function(e){
            isMove = false;
            var _x = e.pageX - x;
            if(_x < maxWidth){ //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                handler.css({'left': 0});
                drag_bg.css({'width': 0});
            }
        });

        //清空事件
        function dragOk(){
            handler.removeClass('handler_bg').addClass('handler_ok_bg');
            text.text('验证通过');
            $d.css({'color': '#fff'});
            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            $('[name="login"]').removeAttr('disabled');
        }
  };

  login.initCanvas().init().drag();
})(jQuery);