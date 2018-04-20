/**
 * Author: 刘彬
 * Create Date: 2018-04-04
 * Description: 成员管理
 */
define([], function() {
    var userCtrl = {
        ServiceType: "controller",
        ServiceName: "userCtrl",
        ViewModelName: 'userViewModel',
        ServiceContent: ['$scope', 'alertService', function($scope, alt) {
            // TODO...
            var $model = $scope.$model;
            var roleArr = $model.$role.data.data.list || [];

            // 默认初始化数据
            var defData = {
                search: {
                    keys: '',
                    roles: '',
                    status: ''
                },
                tip: {
                    id: '',
                    status: ''
                },
                id: '',
                name: '',
                roles: '',
                company: sessionStorage.company || "",
                mobile: '',
                email: '',
                pwd: '',
                roleArr: roleArr,
                submitForm: submitForm,
                addEdit: addEdit,
                opts: optsFn,
                initSearch: initSearch,
                resetFrom: resetFromFn,
                paginationConf: "",
                reset: resetFn
            };

            // 初始化页面数据
            $scope = angular.extend($scope, defData);

            // 编辑新增
            function addEdit (account) {
                // 编辑
                if (account) {
                    $model.detail({
                        account: account || ""
                    }).then(function (res) {
                        res = res.data || {};
                        if (res.ret === '200000') {
                            $scope = angular.extend($scope, {
                                id: res.data.id || "",
                                name: res.data.name || "",
                                roles: res.data.rolesCode || "",
                                mobile: res.data.mobile || "",
                                email: res.data.detail && res.data.detail.email || ""
                            });
                            $scope.$apply();
                            $("#id_user_modal").modal('show');
                        } else {
                            alt.error(res.meassage || "接口异常！！！");
                            console.log('接口异常！！！');
                        }
                    });
                } else {
                    $("#id_user_modal").modal('show');
                }
            }

            // 停用数据
            function optsFn (id, status) {
                $scope.tip = { id: id, status: status };
                $("#id_tip_modal").modal('show');
            }

            // 确认
            $scope.confim = function (id, status) {
                $model.stop({
                    id: id,
                    status: +!status
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        initSearch();
                        $("#id_tip_modal").modal('hide');
                        alt.success("操作成功！");
                    } else {
                        console.log('接口异常！！！');
                    }
                });
            };

            // 表单数据提交函数
            function submitForm (valid, form) {
                valid && $model.postData({
                    id: $scope.id || "",
                    name: $scope.name || "",
                    roles: $scope.roles || "",
                    mobile: $scope.mobile || "",
                    detail: { email: $scope.email || "" },
                    pwd: !$scope.id ? $.md5($scope.pwd) : ""
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        // 重置表单
                        resetFromFn(form);
                        $("#id_user_modal").modal('hide');
                        alt.success("操作成功！");
                        // 查询
                        initSearch();
                    } else {
                        alt.error(res.meassage || "接口异常！！！");
                        console.log('接口异常！！！');
                    }
                });
            }

            // 初始化查询
            function initSearch (obj) {
                $model.getTable(
                    angular.extend($scope.search, {
                        orgCode: sessionStorage.orgCode || "",
                        currentPageNumber: 1,
                        pageSize: 10
                    }, obj)
                ).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var tabArr = res.data.list || [];
                        tabArr = tabArr.sort(function (a, b) {
                            return a.id - b.id;
                        });
                        $scope.tabArr = tabArr || [];
                        $scope.paginationConf = res;
                        $scope.$apply();
                    } else {
                        alt.error(res.meassage || "接口异常！！！");
                        console.log('接口异常!!!');
                    }
                });
            }

            function resetFromFn (form) {
                $scope = angular.extend($scope, {
                    id: '',
                    name: '',
                    roles: '',
                    mobile: '',
                    email: '',
                    pwd: ''
                });
                form.$setPristine();
                // $scope.$apply();
            }

            // 重置函数
            function resetFn () {
                $scope.search = { keys: '', roles: '', status: '' };

                // 重置完之后search一下
                initSearch();
            }

            // 翻页
            $scope.$on('frompagechange', function (e,v,f) {
                initSearch(f);
            });

            $(document).ready(function () {
                // 查询
                initSearch();
            });
        }]
    };

  return userCtrl;
});