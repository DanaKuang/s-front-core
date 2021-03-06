/**
 * Author: liubin
 * Create Date: 2018-05-11
 * Description: 竞猜活动
 */

define([], function () {
    var quizCtrl = {
        ServiceType: 'controller',
        ServiceName: 'quizCtrl',
        ViewModelName: 'quizModel',
        ServiceContent: ['$scope', 'alertService', function ($scope, alt) {
            // 获取actCode
            var url = location.href;
            var actCode = url.split('/').pop();

            var $model = $scope.$model;

            var formDef = {
                form: {
                    id: '',
                    betStatus: '1',
                    hostTeamName: '',
                    guestTeamName: '',
                    hostTeamPic: '',
                    guestTeamPic: '',
                    stimeStr: '',
                    betEtimeStr: '',
                    matchName: '',
                    betLimit: 0,
                    hostWinInject: 0,
                    tieInject: 0,
                    guestWinInject: 0
                }
            };

            // 默认值
            $scope = angular.extend($scope, {
                status: '',
                stime: '',
                etime: '',
                likeName: '',
                listArr: [],
                hostTeamArr: [],
                guestTeamArr: [],
                currentPageNumber: 1,
                pageSize: 10,
                injectCheck: false,
                rateCheck: false,
                getTeamFn: getTeamFn,
                uploadImg: uploadImg,
                form: {},
                paginationConf: '',
                logs: logs,
                addAct: addAct,
                topIdx: topIdx,
                editAct: editAct,
                hideMatch: hideMatch,
                injectNum: injectNum,
                drawMatch: drawMatch,
                submitForm: submitForm,
                showInject: showInject,
                rateChange: rateChange,
                detailReset: detailReset,
                detailSearch: initSearch,
                injectApiNum: injectApiNum,
                drawApiMatch: drawApiMatch,
                startMatchBet: startMatchBet
            }, formDef);

            // 获取team列表
            function getTeamFn (name) {
                $model.team({
                    teamName: event.target.value
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $scope[name] = res.data || [];
                        $scope.$apply();
                    }
                });
            }

            // 新增
            function addAct () {
                $scope.form = angular.extend({}, formDef.form);
                $("[name='form.hostTeamPic']").val('');
                $("[name='form.guestTeamPic']").val('');
                $("#add_edit_form").modal('show');
            }

            // 监控状态变化
            $scope.$watch('form.betStatus', function (n,o,s) {
                if (n != o) {
                    if (n == 2) {
                        s.form.tieInject = 0;
                    }
                }
            });

            // 监控状态变化
            $scope.$watch('injectCheck', function (n,o,s) {
                if (n != o) {
                    if (n == false) {
                        s.form.hostWinInject = 0;
                        s.form.tieInject = 0;
                        s.form.guestWinInject = 0;
                    }
                }
            });

            // 监控状态变化
            $scope.$watch('rateCheck', function (n,o,s) {
                if (n != o) {
                    if (n == false) {
                        s.form.rake = 0;
                    }
                }
            });

            // 编辑
            function editAct (item) {
                $model.detailMatch({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $scope.form = _.pick(angular.extend({}, formDef.form, res.data),
                            'id',
                            'betStatus',
                            'hostTeamName',
                            'guestTeamName',
                            'hostTeamPic',
                            'guestTeamPic',
                            'stimeStr',
                            'betEtimeStr',
                            'matchName',
                            'betLimit',
                            'hostWinInject',
                            'tieInject',
                            'guestWinInject',
                            'rake'
                        );
                        $scope.rateCheck = !!$scope.form.rake;
                        $scope.injectCheck = !!($scope.form.hostWinInject || $scope.form.tieInject || $scope.form.guestWinInject);
                        $scope.$apply();
                        $("[name='form.hostTeamPic']").val('');
                        $("[name='form.guestTeamPic']").val('');
                        $("#add_edit_form").modal('show');
                    }
                });
            }

            // 更新保存
            function submitForm (form) {
                if (!form.$valid) return;
                $model.update(angular.extend($scope.form, {
                    activityCode: actCode
                })).then(function (res) {
                    res = res.data || {};
                    form.$submitted = false;
                    $scope.$apply();
                    if (res.ret == '200000') {
                        $("#add_edit_form").modal('hide');
                        alt.success("成功！");
                        initSearch();
                    } else {
                        alt.error(res.message || "接口异常！");
                    }
                });
            }

            // 图片上传
            function uploadImg (name) {
                var file = event.target.files[0];
                var data = new FormData();
                data.append('file', file);
                $model.upload(data).then(function (res) {
                    if (res.ret == '200000') {
                        $scope.form[name] = res.data.accessUrl;
                        $scope.$apply();
                        alt.success('上传成功！');
                    } else {
                        alt.error('上传失败！');
                    }
                });
            }

            // 主推
            function topIdx (item) {
                $model.topIdx({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $("#id_tips_form .modal-body").html("主推成功！");
                    } else {
                        $("#id_tips_form .modal-body").html(res.message);
                    }
                    $("#id_tips_form").modal('show');
                })
            }

            // 隐藏
            function hideMatch (item) {
                $model.hideMatch({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $("#id_tips_form .modal-body").html("隐藏成功！");
                    } else {
                        $("#id_tips_form .modal-body").html(res.message);
                    }
                    $("#id_tips_form").modal('show');
                });
            }

            // 开奖
            function drawMatch (item) {
                $model.detailMatch({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $scope.matchId = res.data.id || "";
                        $scope.guestTeamName = res.data.guestTeamName || "";
                        $scope.hostTeamName = res.data.hostTeamName || "";
                        $scope.stimeStr = res.data.stimeStr || "";
                        $scope.hostWinPool = res.data.hostWinPool || 0;
                        $scope.tiePool = res.data.tiePool || 0;
                        $scope.guestWinPool = res.data.guestWinPool || 0;
                        $scope.hostRate = res.data.rateResult.hostRate;
                        $scope.tieRate = res.data.rateResult.tieRate;
                        $scope.guestRate = res.data.rateResult.guestRate;
                        $scope.betStatus = res.data.betStatus;
                        $scope.$apply();
                        if ($("#id_draw_match input:checked")[0]) {
                            $("#id_draw_match input:checked")[0].checked = false;
                        }
                        $("#id_draw_match").modal('show');
                    }
                });
            }

            // 赔率管理
            function rateChange (item) {
                $model.detailMatch({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $scope.matchId = res.data.id || "";
                        $scope.guestTeamName = res.data.guestTeamName || "";
                        $scope.hostTeamName = res.data.hostTeamName || "";
                        $scope.stimeStr = res.data.stimeStr || "";
                        $scope.hostWinPool = res.data.hostWinPool || 0;
                        $scope.tiePool = res.data.tiePool || 0;
                        $scope.guestWinPool = res.data.guestWinPool || 0;
                        $scope.hostRate = res.data.rateResult.hostRate;
                        $scope.tieRate = res.data.rateResult.tieRate;
                        $scope.guestRate = res.data.rateResult.guestRate;
                        $scope.betStatus = res.data.betStatus;
                        $scope.$apply();
                        $("#id_rate_change").modal('show');
                    }
                });
            }

            // 开始投注
            function startMatchBet (item) {
                $model.startMatch({
                    id: item.id
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $("#id_tips_form .modal-body").html("设置成功，此场次已开放投注！");
                    } else {
                        $("#id_tips_form .modal-body").html(res.message);
                    }
                    $("#id_tips_form").modal('show');
                });
            }

            // 日志
            function logs (item) {
                $model.expLogs({
                    id: item.id
                });
            }

            // 重置
            function detailReset () {
                angular.extend($scope, {
                    status: '',
                    stime: '',
                    etime: '',
                    likeName: '',
                    curPage: 1
                });
                initSearch();
            }

            // 注入金币弹窗
            function showInject (name) {
                $("#id_inject_num input").val("");
                $("#id_inject_num").data('key', name);
                $("#id_inject_num").modal('show');
            }

            // 注入金叶币
            function injectNum () {
                var key = $("#id_inject_num").data('key');
                var num = $("#id_inject_num input").val();
                $scope[key] += 10*num;
                $model.rate({
                    tiePool: $scope.tiePool,
                    guestWinPool: $scope.guestWinPool,
                    hostWinPool: $scope.hostWinPool
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        $scope.tieRate = res.data.tieRate;
                        $scope.hostRate = res.data.hostRate;
                        $scope.guestRate = res.data.guestRate;
                        $scope.$apply();
                    }
                });
            }

            // 金叶币接口注入
            function injectApiNum () {
                $model.inject({
                    matchId: $scope.matchId,
                    tieInject: $scope.tiePool,
                    hostWinInject: $scope.hostWinPool,
                    guestWinInject: $scope.guestWinPool
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        alt.success("注入成功！");
                        initSearch();
                    } else {
                        alt.error(res.message);
                    }
                });
            }

            // 开奖接口
            function drawApiMatch () {
                var val = $("#id_draw_match input:checked").val();
                if (!val) {
                    alt.error('请选择比赛结果！');
                    return;
                }
                $("#result").html(['','主胜','平局','主负'][val]);
                $("#id_confirm_form").modal('show')
                    .find('.btn-primary')
                    .off()
                    .on('click', function () {
                        $model.drawMatch({
                            matchId: $scope.matchId,
                            resultType: val
                        }).then(function (res) {
                            res = res.data || {};
                            if (res.ret == '200000') {
                                alt.success(res.data);
                                $("#id_confirm_form").modal('hide');
                                $("#id_draw_match").modal('hide');
                                initSearch();
                            } else {
                                alt.error(res.message);
                            }
                        });
                })
            }

            // 初始化查询
            function initSearch (page) {
                angular.extend($scope, page || {})
                $model.getTableData(angular.extend({
                    activityCode: actCode,
                    stime: $scope.stime || "",
                    etime: $scope.etime || "",
                    status: $scope.status || "",
                    likeName: $scope.likeName || "",
                    currentPageNumber: $scope.currentPageNumber,
                    pageSize: $scope.pageSize
                }, page || {})).then(function (res) {
                    var res = res.data || {};
                    if (res.ret === '200000') {
                        $scope.listArr = res.data.list || [];
                        $scope.paginationConf = res;
                        $scope.$apply();
                    }
                });
            }

            // 翻页
            $scope.$on('frompagechange', function (scope, event, page) {
                initSearch(page);
            });

            // 渲染多选
            $(document).ready(function () {

                // 初始化查询
                initSearch();

                $(".date").datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii",
                    autoclose: true,
                    todayBtn: true
                });
                // 结束时间不能修改，根据开始时间+30分钟即可。
                $('.start-time').change(function() {
                    var stime = (new Date($('.start-time').val())).getTime();
                    var etime = new Date(stime).Format("yyyy-MM-dd hh:mm"); // stime-30*60*1000
                    $scope.form.betEtimeStr = etime;
                    $('.end-time').val(etime)
                })
                // 处理时间
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };

                // input搜索输入
                $("#host_team").on('click', 'li', function (e) {
                    $scope.form.hostTeamName = $(e.currentTarget).text();
                    var img = $(e.currentTarget).attr('data-image');
                    if (!!img) {
                        $scope.form.hostTeamPic = img;
                    }
                    $scope.$apply();
                });
                // input搜索输入
                $("#guest_team").on('click', 'li', function (e) {
                    $scope.form.guestTeamName = $(e.currentTarget).text();
                    var img = $(e.currentTarget).attr('data-image');
                    if (!!img) {
                        $scope.form.guestTeamPic = img;
                    }
                    $scope.$apply();
                });
            });
        }]
    };

    return quizCtrl;
});