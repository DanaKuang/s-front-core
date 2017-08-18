/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: retailer
 */

define([], function () {
    var detailCtrl = {
        ServiceType: 'controller',
        ServiceName: 'detailCtrl',
        ViewModelName: 'detailViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, dateFormatFilter) {
            var $model = $scope.$model || {};
            // 日期
            $('[name="startTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var st = e.target.value || '';
                var et = $scope.endTime || '';
                if (et < st) {
                    $scope.endTime = '';
                }
            });
            $('[name="endTime"]').datetimepicker({
                language: "zh-CN",
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                minView: 2,
                startDate: ""
            }).on('change', function (e) {
                var et = e.target.value || '';
                var st = $scope.startTime || '';
                if (et < st) {
                    $scope.startTime = '';
                }
            });

            // 后端数据
            var drop_back_data = $model.$dropShop.data || [];
            drop_back_data = drop_back_data.length ? drop_back_data : [{bizCode:""}];

            // 查询默认值
            $scope = angular.extend($scope, {
                detailSearch: initSearch,
                startTime: dateFormatFilter.date(+new Date),
                endTime: dateFormatFilter.date(+new Date),
                pbArray: [],
                productBrand: "" || $scope.productBrand || "",
                cityArr: drop_back_data,
                cityName: drop_back_data[0].bizCode,
                pnArray: [],
                productName: "" || $scope.productName || "",
                typeArr: [],
                retailerType: "" || $scope.retailerType || "",
                nameArr: [],
                retailerName: "" || $scope.retailerName || ""
            });

            // 初始化
            initSearch();

            // 初始化查询
            function initSearch () {
                $model.getTableData({
                    statType: $scope.type || "",
                    beginTime: $scope.startTime || "",
                    endTime: $scope.endTime || "",
                    productBrand: $scope.productBrand || "",
                    cityName: $scope.cityName || "",
                    productName: $scope.productName || "",
                    retailerType: $scope.retailerType || "",
                    retailerName: $scope.retailerName || ""
                }).then(function (res) {
                    $scope.listArr = res.data || [];
                    $scope.$apply();
                });
            }

            // 初始化multiselect
            $(document).ready(function () {
                var $select = $("form select");
                $select.multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
                var $prBrand = $("[name='productBrand']");
                var $product = $("[name='productName']");
                // 品牌
                $prBrand.multiselect('select', $scope.productBrand);
                $prBrand.multiselect('refresh');
                // 规格
                $product.next().off().on('click', function (e) {
                    $model.getProduct({
                        productBrand: $scope.productBrand
                    }).then(function (res) {
                        $scope.pnArray = res.data || [];
                        $scope.$apply();
                        $product.multiselect('dataprovider', _.forEach(res.data, function(val) {
                            val.label = val.productName;
                            val.value = val.sn;
                        }));
                        $product.multiselect('select', $scope.productName);
                        $product.multiselect('refresh');
                    });
                });
            });

        }]
    };

  return detailCtrl;
});