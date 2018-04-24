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
    var $acc = $('[name="account"]');
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
        var tel = $tel.val();
        if (!tel) return;
        if ($tel.parent().hasClass('has-error')) return;
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
        $.ajax({
            url: '/api/tztx/saas/admin/login/getDynamicCode',
            data: { oc: 1, mobile: tel },
            type: 'POST'
        });
    });

    // 下一步
    $("button.first").off().click(function (e) {
        var tel = $tel.val();
        var cod = $cod.val();
        if (!tel) return;
        if (!cod) return;
        if ($tel.parent().hasClass('has-error')) return;
        $.ajax({
            url: '/api/tztx/saas/admin/login/checkDynamicCode',
            data: { mobile: tel, code: cod },
            type: 'POST'
        }).then(function (res) {
            if (res.ret == '200000') {
                $(".first").hide();
                $(".second").show();
            } else {
                alert(res.message || "验证码不正确！");
            }
        });

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
        if (flag < 2 || val.length < 8 || val.length > 16) {
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

    // 确定
    $("button.second").off().click(function (e) {
        var pwd = $pwd.val();
        var rwd = $rwd.val();
        var acc = $acc.val();
        var tel = $tel.val();
        if (!acc) return;
        if (!pwd) return;
        if (!rwd) return;
        if ($pwd.parent().hasClass('has-error')) return;
        if ($rwd.parent().hasClass('has-error')) return;
        if (pwd != rwd) return;
        $.ajax({
            url: '/api/tztx/saas/admin/login/findPwd',
            data: { oldPwd: '', account: acc, newPwd: $.md5(pwd), mobile: tel},
            type: 'POST',
            dataType: 'json'
        }).then(function (res) {
            if (res.ret == '200000') {
                alert(res.message || "密码修改成功，请重新登陆！");
                window.location.href = "/login";
            } else {
                alert(res.message || "找回密码失败！");
            }
        });

    });
})(jQuery);