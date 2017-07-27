/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var giftController = {
        ServiceType: 'controller',
        ServiceName: 'GiftCtrl',
        //ViewModelName: 'agreeViewModel',
        ServiceContent: ['$scope', function ($scope) {
            console.log('agree controller is under control.');
        }]
    };

    return giftController;
});