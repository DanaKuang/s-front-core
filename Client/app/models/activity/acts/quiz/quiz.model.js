/**
 * Author: liubin
 * Create Date: 2018-05-11
 * Description: 竞猜活动
 */

define([], function () {
    var quizModel = {
        ServiceType: 'service',
        ServiceName: 'quizModel',
        ServiceContent: ['request', function (request) {

            this.$model = function () {

                var hnUrl = sessionStorage.orgCode === 'hunanzhongyan' ? 'orange/' : '';      // 是否是湖南

                var GET_TABLE_DATA = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/listMatch";      // 表格数据

                var POST_TOP_IDX = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/topIdx";           // 主推

                var POST_HIDE_MATCH = "/api/tztx/saas/saotx/worldcup/hideMatch";              // 隐藏

                var POST_START_MATCH = "/api/tztx/saas/saotx/worldcup/startMatchBet";         // 开始投注

                var POST_DETAIL_MATCH = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/matchDetail"; // 详情

                var POST_DRAW_MATCH = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/drawMatch";     // 开奖

                var POST_LOGS_EXPORT = "/api/tztx/saas/saotx/worldcup/searchMatchDatas";      // 日志导出

                var POST_RATE_MATCH = "/api/tztx/saas/saotx/worldcup/rate";                   // 赔率计算

                var POST_INJECT_MATCH = "/api/tztx/saas/saotx/worldcup/inject";               // 金币注入

                var POST_TEAM_NAME = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/searchTeam";     // 球队关键字查询

                var UPLOAD_IMG_FILE = "/api/tztx/saas/saotx/attach/commonAliUpload";          // 图片上传

                var UPDATA_MATCH = "/api/tztx/saas/saotx/"+hnUrl+"worldcup/saveOrModifyMatch";// 更新列表字段

                // 表格数据
                this.getTableData = function (params) {
                    return request.$Search(GET_TABLE_DATA, params);
                };

                // 主推
                this.topIdx = function (params) {
                    return request.$Search(POST_TOP_IDX, params);
                };

                // 隐藏
                this.hideMatch = function (params) {
                    return request.$Search(POST_HIDE_MATCH, params);
                };

                // 开始投注
                this.startMatch = function (params) {
                    return request.$Search(POST_START_MATCH, params);
                };

                // 详情
                this.detailMatch = function (params) {
                    return request.$Search(POST_DETAIL_MATCH, params);
                };

                // 开奖
                this.drawMatch = function (params) {
                    return request.$Search(POST_DRAW_MATCH, params);
                };

                // 赔率计算
                this.rate = function (params) {
                    return request.$Search(POST_RATE_MATCH, params);
                };

                // 金币注入
                this.inject = function (params) {
                    return request.$Search(POST_INJECT_MATCH, params);
                };

                // 球队关键字查询
                this.team = function (params) {
                    return request.$Search(POST_TEAM_NAME, params);
                };

                // 更新列表字段
                this.update = function (params) {
                    return request.$Search(UPDATA_MATCH, params);
                };

                // 图片上传
                this.upload = function (params) {
                    return $.ajax({
                        url: UPLOAD_IMG_FILE,
                        type: 'POST',
                        data: params,
                        headers: {
                            ContentType: "multipart/form-data",
                            token: sessionStorage.getItem('access_token'),
                            loginId: sessionStorage.getItem('access_loginId')
                        },
                        cache: false,
                        processData: false,
                        contentType: false,
                        dataType: 'json'
                    })
                };

                // 日志导出
                this.expLogs = function (params) {
                    var xhr = new XMLHttpRequest();
                    var formData = new FormData();
                    for(var attr in params) {
                        formData.append(attr, params[attr]);
                    }
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                    xhr.open('POST', POST_LOGS_EXPORT, true);
                    xhr.responseType = "blob";
                    xhr.responseType = "arraybuffer"
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
                    return xhr.send(formData);
                };
            };
        }]
    };
    return quizModel;
});
