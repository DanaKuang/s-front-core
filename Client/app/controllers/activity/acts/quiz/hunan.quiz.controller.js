/**
 * Author: liubin
 * Create Date: 2018-05-11
 * Description: 竞猜活动
 */

define([], function () {
    var hunanQuizCtrl = {
        ServiceType: 'controller',
        ServiceName: 'hunanQuizCtrl',
        ViewModelName: 'quizModel',
        ServiceContent: ['$scope', 'alertService', 'dateFormatFilter', function ($scope, alt, dff) {

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
                    betStimeStr: ''
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
                pageSize: 10,
                currentPageNumber: 1,
                paginationConf: '',
                form: {},
                addAct: addAct,
                topIdx: topIdx,
                editAct: editAct,
                getTeamFn: getTeamFn,
                uploadImg: uploadImg,
                drawMatch: drawMatch,
                submitForm: submitForm,
                detailReset: detailReset,
                detailSearch: initSearch,
                drawApiMatch: drawApiMatch
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
                            'betStimeStr'
                        );
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
                $model.update($scope.form).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        form.$submitted = false;
                        $("#add_edit_form").modal('hide');
                        alt.success($scope.form.id ? "更新成功！" : "新建成功！");
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

            // 编辑详情
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

            // 开奖接口
            function drawApiMatch () {
                var val = $("#id_draw_match input:checked").val();
                if (!val) {
                    alt.error('请选择比赛结果！');
                    return;
                }
                $model.drawMatch({
                    matchId: $scope.matchId,
                    resultType: val
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret == '200000') {
                        alt.success(res.data);
                        $("#id_draw_match").modal('hide');
                        initSearch();
                    } else {
                        alt.error(res.message);
                    }
                });
            }

            // 初始化查询
            function initSearch (page) {
                angular.extend($scope, page || {})
                $model.getTableData(angular.extend({
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

    return hunanQuizCtrl;
});
