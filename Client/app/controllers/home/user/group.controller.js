/**
 * Author: jinlinyong
 * Create Date: 2017-09-12
 * Description: group
 */

define([], function () {
    var GroupController = {
      ServiceType: 'controller',
      ServiceName: 'GroupCtrl',
      ViewModelName: 'GroupViewModel',
      ServiceContent: ['$scope','setDateConf', function ($scope,setDateConf) {
        var echarts = require('echarts');
        var $model = $scope.$model;
        setDateConf.init($(".group-month"), 'month');
        var amonth = (new Date().getMonth() + 1)<10 ? '0'+ (new Date().getMonth() + 1):(new Date().getMonth() + 1);
        var yearMonth = new Date().getFullYear() + "-"  + amonth;
        $(".group-month").find("input").val(yearMonth);        
        var defaultMonth = {"statDate":yearMonth};
        $scope.search = function() {
      
        };
        $scope.monScanUvConf = {
          Arr: []
        };
        $scope.monScanActUv = {
          Arr: []
        };
        $scope.monScanNewUv = {
          Arr: []
        };

        function Global(data,brand) {
          var obj1 = {};
          var obj2 = {};
          var obj3 = {};
          $model.$getScanNumberUsers(data).then(function(res) {
            var res =res.data || {};
            obj1.tMonth = res.monaddScanUv;
            obj2.tMonth = res.monaddScanActUv;
            obj3.tMonth = res.monaddScanNewUv;
            obj1.lMonth = res.retMonaddScanUv;
            obj2.lMonth = res.retMonaddScanActUv;
            obj3.lMonth = res.retMonaddScanNewUv;
            $model.$getTagName().then(function(res){
              var res = res.data;
              $(res).each(function(index,n){
                if (n.tagId === "10001") {
                  obj1.title = n.tagName;
                  $scope.monScanUvConf = {
                    Arr: [obj1]
                  };
                } else if (n.tagId === "10002") {
                  obj2.title = n.tagName;
                  $scope.monScanActUv = {
                    Arr: [obj2]
                  };               
                } else if (n.tagId === "10003") {
                  obj3.title = n.tagName;
                  $scope.monScanNewUv = {
                    Arr:[obj3]
                  };
                }
                $scope.$apply();                
              })
            })
          });
        };

        Global(defaultMonth);






      }]
    };
  
    return GroupController;
  });