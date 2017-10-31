/**
 * Author: liubin
 * Create Date: 2017-10-16
 * Description: style
 */
define([], function() {
    var styleCtrl = {
        ServiceType: "controller",
        ServiceName: "styleCtrl",
        ViewModelName: 'styleViewModel',
        ServiceContent: ['$scope', function($scope) {
            // TODO...
            $scope.pageArr = [{
                name: '扫码验真',
                pageid: '1'
            }, {
                name: '活动中心',
                pageid: '2'
            }, {
                name: '积分商城',
                pageid: '3'
            }, {
                name: '个人中心',
                pageid: '4'
            }];
        }]
    };

  return styleCtrl;
});