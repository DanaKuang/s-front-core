/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDayDetailCtrl = {
        ServiceType: 'controller',
        ServiceName: 'mdDetailCtrl',
        ViewModelName: 'mdDetailModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;

            var bnArr = $model.$brand.data || [];
            var weekArr = $model.$week.data || [];

            // 测试数据
            var listArr = [{
                orderid: 12345,
                nickname: '测试',
                activityname: '测试',
                prize: '测试',
                prizename: '测试',
                productname: '测试',
                address: '测试',
                createtime: '测试',
                origin: '测试',
                status: '测试'
            }];
            $model.data = [{name: '测试', code: '1'}];

            // 默认值
            $scope = angular.extend($scope, {
                stArr: $model.data,
                status: $model.data[0].code || '',
                region: '',
                weekArr: weekArr,
                weekTime: weekArr[0].weekNo || '',
                bnArr: bnArr,
                brandName: bnArr[0].brandCode || '',
                pnArr: [],
                productName: '',
                pArr: $model.data,
                prize: $model.data[0].code || '',
                listArr: listArr,
                detailSearch: initSearch,
                showDetail: showDetail,
                obj: {},
                export: function () {
                    alert('还没写完呢，急啥？');
                }
            });

            // 初始化查询
            function initSearch () {
                $model.getTableData({
                }).then(function (res) {
                    var data = res.data || [];
                    $scope.listArr = [];
                    $scope.$apply();
                });
            }

            // 下拉框
            function initDropdown (productBrand) {
                var $productSn = $("[name='productName']");
                $model.getProduct({
                    productBrand: productBrand
                }).then(function (res) {
                    $scope.pnArray = res.data || [];
                    $scope.$apply();
                    $productSn.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        val.label = val.productName;
                        val.value = val.sn;
                    }));
                    $scope.productSn = $scope.pnArray.map(function(m){return m.sn;});
                    $productSn.multiselect('select', $scope.productSn);
                    $productSn.multiselect('refresh');
                    // 初始化
                    // initSearch();
                });
            }

            // 显示详情信息
            function showDetail (id) {
                $scope.obj = angular.extend($scope.obj, listArr[0]);
                $("#detailModalId").modal('show');
            }

            // 渲染多选
            $(document).ready(function () {
                var $brand = $('[name="brandName"]');
                var $productSn = $('[name="productName"]');
                // 多选
                $(".ui-search-panel select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
                // 品牌
                $brand.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择',
                    onChange: function (opt) {
                        $model.getProduct({
                            productBrand: opt[0].value || event.target.value || ""
                        }).then(function (res) {
                            $scope.pnArr = res.data || [];
                            $scope.$apply();
                            $productSn.multiselect('dataprovider', _.forEach(res.data, function(val) {
                                val.label = val.productName;
                                val.value = val.sn;
                            }));
                            $scope.productName = $scope.pnArr.map(function(m){return m.sn;});
                            $productSn.multiselect('select', $scope.productName);
                            $productSn.multiselect('refresh');
                        });
                    }
                });
                $brand.multiselect('select', $scope.brandName);
                $brand.multiselect('refresh');
                // 规格
                $productSn.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
                initDropdown($scope.brandName);
            });
        }]
    };

    return memberDayDetailCtrl;
});