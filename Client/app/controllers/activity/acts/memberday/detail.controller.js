/**
 * Author: liubin
 * Create Date: 2018-01-03
 * Description: 会员日活动设置
 */

define([], function () {
    var memberDayDetailCtrl = {
        ServiceType: 'controller',
        ServiceName: 'mdDetailCtrl',
        ViewModelName: 'mdDetailCtrl',
        ServiceContent: ['$scope', 'dateFormatFilter', function ($scope, df) {
            var $model = $scope.$model;
            // 默认值
            $scope = angular.extend($scope, {
                stArr: [],
                status: '',
                region: '',
                weekTime: '',
                bnArr: [],
                brandName: '',
                pnArr: [],
                productName: '',
                pArr: [],
                prize: ''
            });

            // 渲染多选
            $(document).ready(function () {
                $(".ui-search-panel select").multiselect({
                    nonSelectedText: '请选择',
                    allSelectedText: '全部',
                    nSelectedText: '已选择'
                });
            });
        }]
    };

    return memberDayDetailCtrl;
});