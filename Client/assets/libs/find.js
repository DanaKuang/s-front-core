/**
 * Author: liubin
 * Create Date: 2017-08-08
 * Description: 找回密码
 */

(function ($,undefined) {
    'use strict';
    var times = 60;
    var interval = null;
    var $pwd = $('[name="password"]');
    var $tel = $('[name="telphone"]');
    var $rwd = $('[name="rePassword"]');
    var $cod = $('[name="validatecode"]');
    var TELPHONE = /^1[3,4,5,7,8,9]{1}\d{9}$/;
    var PASSWORD = [/[A-Za-z]/g, /[0-9]/g, /_/g];

    $(".first").show();
    $(".second").hide();

    // 手机号验证
    $tel.focusout(function (e) {
        e.stopPropagation();
        var val = '' + e.target.value;
        val = val.trim();
        if (!val) return;
        if (TELPHONE.test(val)) {
            $tel.parent().removeClass('has-error');
        } else {
            !$tel.parent().hasClass('has-error') && $tel.parent().addClass('has-error');
        }
    });

    // 验证码按钮
    $(".ui-validate").click(function () {
        var that = this;
        var tip = '重新获取(60s)';
        $(that).html(tip).prop('disabled', true);
        interval = setInterval(function () {
            if (--times < 0) {
                clearInterval(interval);
                interval = null;
                times = 60;
                $(that).html('获取验证码').prop('disabled', false);
                return;
            }
            $(that).html('重新获取('+times+'s)');
        }, 1000);
    });

    // 下一步
    $("button.first").off().click(function (e) {
        $(".first").hide();
        $(".second").show();
    });

    // 密码
    $pwd.focusout(function (e) {
        var val = '' + e.target.value;
        val = val.trim();
        if (!val) return;
        var flag = 0;
        PASSWORD.forEach(function (p) {
            p.test(val) && flag++;
        });
        if (flag < 2 || val.length < 6 || val.length > 14) {
            !$pwd.parent().hasClass('has-error') &&
            $pwd.parent().addClass('has-error');
        } else {
            $pwd.parent().removeClass('has-error');
        }
    });

    // 确认密码
    $rwd.focusout(function (e) {
        var pwd = $pwd.val();
        var val = e.target.value;
        if (!pwd || !val) return;
        if (pwd !== val) {
            !$rwd.parent().hasClass('has-error') &&
            $rwd.parent().addClass('has-error');
        } else {
            $rwd.parent().removeClass('has-error');
        }
    });
})(jQuery);