## 页面开发笔记
    Create Date: 2017-08-14
    Author: 刘彬
    Description: 活动模块
## 开发模块
    mPrizeGotHistory                          ## 模块名称 
    mPrizeGotHistoryCtrl                      ## 控制器名称
    mPrizeGotHistoryModel                     ## 视图模版
    mPrizeGotHistory                          ## 页面文件
## 后端接口说明
    
## 问题及解决办法
    1) 文件流格式文件下载问题
    warn：在读之前请知悉熟读jquery的ajax的api【http://hemin.cn/jq/jQuery.ajax.html】
    jquery[v1.12.1]
    ajax支持dataType返回类型有xml、json、text、html、jsonp、script。
    需要注意的是，官方有文明确强调：“我们必须确保网页服务器报告的MIME类型与我们选择的dataType所匹配。比如说，XML的话，服务器端就必须声明 text/xml 或者 application/xml 来获得一致的结果。”
    （1）text和xml类型：返回的数据不会经过处理。数据仅仅简单的将XMLHttpRequest的responseText或responseHTML属性传递给success回调函数。
    （2）html类型：任何内嵌的JavaScript都会在HTML作为一个字符串返回之前执行。
    （3）script类型：也会先执行服务器端生成JavaScript，然后再把脚本作为一个文本数据返回。
    （4）json类型：则会把获取到的数据作为一个JavaScript对象来解析，并且把构建好的对象作为结果返回。为了实现这个目的，他首先尝试使用JSON.parse()。如果浏览器不支持，则使用一个函数来构建。JSON数据是一种能很方便通过JavaScript解析的结构化数据。
    （5）jsonp类型：会创建一个查询字符串参数 callback=? ，这个参数会加在请求的URL后面。服务器端应当在JSON数据前加上回调函数名，以便完成一个有效的JSONP请求。如果要指定回调函数的参数名来取代默认的callback，可以通过设置$.ajax()的jsonp参数。
    如果指定了script或者jsonp类型，那么当从服务器接收到数据时，实际上是用了&lt;script&gt;标签而不是XMLHttpRequest对象。这种情况下，$.ajax()不再返回一个XMLHttpRequest对象，并且也不会传递事件处理函数，比如beforeSend。
    2）话不多说直接上代码
    ```javascript
    var url = "/api/tztx/saas/saotx/order/exportOrder";
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    for(var attr in data) {
        formData.append(attr, data[attr]);
    }
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.open('POST', url, true);
    xhr.responseType = "blob";
    xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
    xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
    xhr.onload = function(res) {
        if (this.status == 200) {
            var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
            var respHeader = xhr.getResponseHeader("Content-Disposition");
            var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }
    }
    xhr.send(formData);
    ```
## MOERE
