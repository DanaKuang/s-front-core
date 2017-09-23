/**
 * Author: kuang
 * Create Date: 2017-09-20
 * Description: cigarettemange
 */

define([], function () {
  	var cigarettemanageController = {
    	ServiceType: 'controller',
    	ServiceName: 'cigarettemanageCtrl',
    	ViewModelName: 'cigarettemanageModel',
    	ServiceContent: ['$rootScope', '$scope', 'cigarettemanageModel', 'dateFormatFilter', function ($rootScope, $scope, $model, dateFormatFilter) {

    			// 获取列表数据
          $model.getlist().then(function (res) {
            $scope.cigarettelistConf = res.data;
          })

          $scope.$on('choosebrands', function(e,v,f) {
            $model.getbrands().then(function(res) {
              var createcigarette_scope = angular.element('.create-cigarette-body').scope();
              var data = res.data.data;
              if (!createcigarette_scope.conf) {
                createcigarette_scope.conf = {}
              }
              createcigarette_scope.conf.brandlist = data;
            })
          })

          $scope.$on('cigarettestyle', function (e,v,f) {
            $model.checkstyle().then(function (res) {

            })
          })

          $scope.$on('cigarettetype', function (e,v,f) {
            $model.checktype().then(function (res) {

            })
          })

          $scope.$on('cigarettepack', function (e,v,f) {
            $model.checkpack().then(function (res) {

            })
          })

          $scope.$on('cigarettegrade', function (e,v,f) {
            $model.checkgrade().then(function (res) {

            })
          })

          $scope.$on('checksn', function (e,v,f) {
            $model.checksn(f).then(function(res) {
              var createcigarette_scope = angular.element('.create-cigarette-body').scope();
              if (res.data.data) {
                if (!createcigarette_scope.conf) {
                  createcigarette_scope.conf = {};
                }
                createcigarette_scope.conf.snData = res.data.data;
              } else {
                createcigarette_scope.disabled = false;
              }
            })
          })

    	}]
  	}
  	return cigarettemanageController
})