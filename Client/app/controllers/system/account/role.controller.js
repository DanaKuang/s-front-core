/**
 * Author: {author}
 * Create Date: 2017-10-16
 * Description: role
 */
define([], function() {
    var roleCtrl = {
        ServiceType: "controller",
        ServiceName: "roleCtrl",
        ViewModelName: 'roleViewModel',
        ServiceContent: ['$scope', function($scope) {
            // TODO...
            var $model = $scope.$model;
            var roleArr = $model.$role.data.data.list || [];
            var treeObj = '';

            // 默认初始化数据
            var defData = {
                search: {
                    roleCode: '',
                    status: ''
                },
                tip: {
                    id: '',
                    status: ''
                },
                roleName: '',
                roleCode: '',
                id: '',
                roleArr: roleArr,
                submitForm: submitForm,
                addEdit: addEdit,
                opts: optsFn,
                initSearch: initSearch,
                paginationConf: '',
                confim: confimFn,
                reset: resetFn
            };

            // 初始化页面数据
            $scope = angular.extend($scope, defData);

            // 编辑新增
            function addEdit (roleCode) {
                $model.detail({
                    roleCode: roleCode || ""
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        $scope.roleName = res.data.roleName || "";
                        initTree(res.data.nodes || []);
                        $("#id_role_modal").modal('show');
                    } else {
                        console.log('接口异常!!!');
                    }
                });
            }

            // 停用数据
            function optsFn (id, status) {
                $scope.tip = { id: id, status: status };
                $("#id_tip_modal").modal('show');
            }

            // 停用、启用
            function confimFn (id, status) {
                $model.stop({
                    id: id,
                    status: +!status
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        initSearch();
                        $("#id_tip_modal").modal('hide');
                    } else {
                        console.log('接口异常！！！');
                    }
                });
            }

            // 表单数据提交函数
            function submitForm () {
                var menus = treeObj.getCheckedNodes();
                $model.postData({
                    menus: menus.map(function (m) {
                            return m.id;
                        }).join(','),
                    roleName: $scope.roleName || "",
                    id: $scope.id,
                    roleCode: $scope.roleCode
                }).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        $("#id_role_modal").modal('hide');
                        $scope.roleName = "";
                        initSearch();
                    } else {
                        console.log('接口异常！！！');
                    }
                });
            }

            // 初始化查询
            function initSearch (obj) {
                $model.getTable(angular.extend($scope.search, {
                    orgCode: sessionStorage.orgCode || "",
                    currentPageNumber: 1,
                    pageSize: 10
                }, obj)).then(function (res) {
                    res = res.data || {};
                    if (res.ret === '200000') {
                        var ret = res.data.list || [];
                        $scope.tableArr = ret;
                        $scope.paginationConf = res;
                        $scope.$apply();
                    } else {
                        console.log('接口异常！！！');
                    }
                });
            }

            // 初始化树
            function initTree (nodes) {
                $("#id_role_tree").html("");
                treeObj = $.fn.zTree.init($("#id_role_tree"), {
                    check: {
                        enable: true
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: { }
                }, nodes);
            }

            // 重置函数
            function resetFn () {
                $scope.search = { roleCode: '', status: '' };

                // 重置完之后search一下
                initSearch();
            }

            $(document).ready(function () {
                // 查询
                initSearch();
            });
        }]
    };

  return roleCtrl;
});