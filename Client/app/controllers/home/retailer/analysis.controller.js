/**
 * Author: {author}
 * Create Date: {date}
 * Description: {desp}
 */

define([], function () {
    var analysisCtrl = {
        ServiceType: 'controller',
        ServiceName: 'analysisCtrl',
        ViewModelName: 'analysisViewModel',
        ServiceContent: ['$scope', function ($scope) {
            console.log('analysisCtrl loading...');
            var $model = $scope.$model || {};

        }]
    };

  return analysisCtrl;
});