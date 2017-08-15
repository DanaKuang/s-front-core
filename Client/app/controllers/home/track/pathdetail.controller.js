/**
 * Author: liubin
 * Create Date: 2017-08-02
 * Description: pathdetail
 */

define([], function () {
  var pathdetial = {
    ServiceType: 'controller',
    ServiceName: 'pathdetialCtrl',
    ViewModelName: 'pathdetailViewModel',
    ServiceContent: ['$scope', 'dateFormatFilter', 'analysisFilter', function ($scope, dateFormatFilter, a_f) {
        var $model = $scope.$model;

        // 后端数据
        var brand_back_data = $model.$brand.data || [];
        brand_back_data = brand_back_data.length ? brand_back_data : [{productBrand: ""}];
        var act_back_data = $model.$activity.data || [];
        act_back_data = act_back_data.length ? act_back_data : [{activityName: "无数据", activityId: ""}];

        // 默认配置
        $scope.pathConf = {
            startTime: dateFormatFilter.date(+new Date),
            endTime: dateFormatFilter.date(+new Date),
            pbArray: brand_back_data,
            productBrand: brand_back_data[0].productBrand || "",
            pnArray: [],
            acArray: act_back_data,
            activityId: "ACT-C7MTZ3P6197" || act_back_data[0].activityId || "",
            pgArray: [],
            pagename: "",
            pathSearch: pathSearch
        };

        // 查询入口
        function pathSearch () {
            var pScope = angular.element('.ui-path-search').scope();
            console.log(pScope);
            var params = {
                productBrand: pScope.productBrand || "所有",
                productSn: pScope.productName && pScope.productName.join(',') || "99999999",
                activityId: pScope.activityId || "",
                cityName: $scope.cityName || "合计",
                timeType: pScope.startTime == pScope.endTime ? "hour" : "day",
                webId: pScope.pagename || "",
                startTime: pScope.startTime || "",
                endTime: pScope.endTime || ""
            };
            initFormData(params);
            // 初始化pageEvent
            initPageEvent(params);
        }

        // 初始化select
        $(document).ready(function () {
            var pScope = angular.element('.ui-path-search').scope();

            $(".ui-path-search select.multiple").multiselect({
                nonSelectedText: '请选择',
                allSelectedText: '全部',
                nSelectedText: '已选择'
            });
            var $prBrand = $("[name='productBrand']");
            var $product = $("[name='productName']");
            var $activity = $("[name='activityId']");
            var $pagename = $("[name='pagename']");
            // 品牌
            $prBrand.multiselect('select', pScope.productBrand);
            $prBrand.multiselect('refresh');
            // 活动名称
            $activity.multiselect('select', pScope.activityId);
            $activity.multiselect('refresh');
            // 规格
            $product.next().off().on('click', function (e) {
                $model.getProduct({
                    productBrand: pScope.productBrand
                }).then(function (res) {
                    pScope.pnArray = res.data || [];
                    pScope.$apply();
                    $product.multiselect('dataprovider', _.forEach(res.data, function(val) {
                        val.label = val.productName;
                        val.value = val.sn;
                    }));
                    $product.multiselect('select', pScope.productName);
                    $product.multiselect('refresh');
                });
            });
            // 活动页面
            $pagename.next().children('.multiselect').off().on('click', function (e) {
                $model.getActPage({
                    activityId: pScope.activityId
                }).then(function (res) {
                    pScope.pgArray = res.data || [];
                    pScope.$apply();
                    $pagename.multiselect("destroy").multiselect('dataprovider', _.forEach(res.data, function(val) {
                        val.label = val.page_name;
                        val.value = val.page_code;
                    }));
                    $pagename.multiselect('select', pScope.webId || pScope.pgArray[0].page_code);
                    $pagename.multiselect('refresh');
                });
            });
            // 默认值入口
            pathSearch();
        });

        // 初始化页面流入流出
        function initFormData (params) {
            // 页面流入
            $model.getPageIn(params).then(function (res) {
                $scope.fromOutData = res.data || [];
                $scope.visitin = _.sum(res.data, function (o) {
                    return o.activePv;
                });
                // 转换率
                $scope.visitin && $scope.visitout &&
                ($scope.visitrate = transRate($scope.visitin, $scope.visitout));
                $scope.$apply();
            });
            // 页面流出
            $model.getPageOut(params).then(function (res) {
                $scope.fromInData = res.data || [];
                $scope.visitout = _.sum(res.data, function (o) {
                    return o.activePv;
                });
                // 转换率
                $scope.visitin && $scope.visitout &&
                ($scope.visitrate = transRate($scope.visitin, $scope.visitout));
                $scope.$apply();
            });

            // 转化率
            function transRate (i, o) {
                i = Number(i); o = Number(o);
                return '' + ((i/o)*100).toFixed(2) + '%';
            }
        }

        // 初始化pageEvent
        function initPageEvent (params) {
            $model.getPageEvent(params).then(function (res) {
                var pScope = angular.element('.ui-path-search').scope();
                $scope.startTime = pScope.startTime;
                $scope.endTime = pScope.endTime;
                $scope.targetData = a_f.pvFilter(res.data) || [];
                $scope.$apply();
            });
        }
    }]
  };

  return pathdetial;
});