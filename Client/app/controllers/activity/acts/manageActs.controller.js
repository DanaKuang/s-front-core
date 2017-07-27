/**
 * Author: kuang
 * Create Date: 2017-07-18
 * Description: manageActs
 */

define([], function () {
  	var manageActsController = {
    	ServiceType: 'controller',
    	ServiceName: 'manageActsCtrl',
    	ViewModelName: 'manageActsModel',
    	ServiceContent: ['$scope', 'manageActsModel', 'dateFormatFilter', function ($scope, $model, dateFormatFilter) {
      		console.log('manageActs controller is under control.');

      		$("#durationStart").datetimepicker({
		      	format: 'yyyy-mm-dd hh:ii:ss', 
		      	language: 'zh-CN',
		      	weekStart: 1,
		        todayBtn:  1,
		        autoclose: 1,
		        todayHighlight: 1,
		        startView: 2,
		        minView: 2,
		        forceParse: 0
      		});
      
      		$("#durationEnd").datetimepicker({
		      	format: 'yyyy-mm-dd hh:ii:ss', 
		      	language: 'zh-CN',
		      	weekStart: 1,
		        todayBtn:  1,
		        autoclose: 1,
		        todayHighlight: 1,
		        startView: 2,
		        minView: 2,
		        forceParse: 0
      		});

      		
          // 获取活动列表
          $scope.$on('frompagechange', function (e,v, f) {
            $model.getActivityList(f).then(function(res) {
              $scope.activitylistConf = res.data;
              $scope.paginationConf = res.data;
            })
          })

          // 获取活动模板sample
      		$model.getActSampleList().then(function (res) {
        		$scope.createActModalConf = res.data;
      		});

          // 点击模板sample调用接口,获取模板对应的配置页面
          $scope.$on('typefromActSample', function (e,v,f) {
            $model.getTemplateSpecific(f).then(function(res){
              $scope.allConfigTemplateConf = res.data;
              // 抽奖都是common
              // redpack是红包
              // qa是问答
              // holiday节假日
              // unexpected 彩蛋
            })
          })

          // 获取地区
          $model.getAreaList().then(function (res) {

          })

          $model.getTierArea({parentCode: 0}).then(function(res){
            
          })
          
        
          // 新增活动
          // document.querySelector('#submitPrize').onclick = function() {
          //   var addNewActivity_data = {
          //     pageName: 
          //   }
          //   $model.addNewActivity(addNewActivity_data).then(function(res){

          //   })
          // } 
          $scope.$on('fromcommonactivity', function(e,v,f){
            console.log(f);
            // $model.addNewActivity().then(function(res){

            // })
          })
          var addNewActivityData = {
            copyOfPageCode: 'jiugongge',
            status: 1,
            name: '测试新建第一个活动',
            description: '我是活动描述',
            idx: 100,
            score: 10,
            limitPer: 1,
            limitAll: 10,
            activityForm: 'act-5',
            supplier: '湖南中烟',
            brands: ['白沙', '芙蓉王'],
            sns: ['6901028192095'],
            areaCodes: ['南昌', '北京'],
            holiday: 3,
            specialAwards: 1,
            specialAwardPics: ['https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png'],
            specialAwardNums: 10,
            specialAwardScores: 10,
            chance: '10%',
            commonAwards: [1,2],
            commonAwardPics: ['https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png', 'https://weiopn.oss-cn-beijing.aliyuncs.com/chengxing/image/or-logo.png'],
            commonAwardNums: 1000,
            commonAwardScores: 0
          }
          // $model.addNewActivity(addNewActivityData).then(function(res){

          // })
    	}]
  	}
  	return manageActsController
})
