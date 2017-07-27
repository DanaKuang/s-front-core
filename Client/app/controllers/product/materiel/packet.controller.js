/**
 * Created by zhaobaoli on 2017/7/17.
 */
define([], function () {
    var packetController = {
        ServiceType: 'controller',
        ServiceName: 'PacketCtrl',
        //ViewModelName: 'agreeViewModel',
        ServiceContent: ['$scope', function ($scope) {
            console.log('agree controller is under control.');
        }]
    };

    return packetController;
});