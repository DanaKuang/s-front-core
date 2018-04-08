/**
 * Author: liubin
 * Create Date: 2017-06-27
 * Description: index
 */

define([], function () {
    var CodeCtrl = {
        ServiceType: "controller",
        ServiceName: "CodeCtrl",
        ViewModelName: 'codeViewModel',
        ServiceContent: ['$scope', 'dateFormatFilter', 'formatFilter', function ($scope, dateFormatFilter, formatFilter) {
            var $model = $scope.$model;

        }]
    };

  return CodeCtrl;
});