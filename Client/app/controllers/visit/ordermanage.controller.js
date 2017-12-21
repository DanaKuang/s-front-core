/**
 * Author: hanzha
 * Create Date: 2017-11-28
 * Description: [重构]
 */

define([], function () {
  var visitOrderManageCtrl = {
    ServiceType: "controller",
    ServiceName: "visitOrderManageCtrl",
    ViewModelName: 'visitManageModel',
    ServiceContent: ['$rootScope', '$scope', '$timeout', 'visitManageModel', 'dateFormatFilter', function ($rootScope, $scope, $timeout, $model, dateFormatFilter) {

      // 初始化一个对象，vm
      $scope.vm = {
        status: '',
        searchType: 1, // 关键词类型
        keywords: '',
        stime: '',
        etime: '',
        pageNo: 1,
        pageSize: 10,
        listData: [],
      }
      $scope.isChecked = false

        // 获取table列表
      function getList(page, ispage) {
        var data = {
          status: $scope.vm.status || '',
          searchType: $scope.vm.searchType || '', // 关键词
          keywords: $scope.vm.keywords || '', // 关键词
          stime: $scope.vm.stime || '',
          etime: $scope.vm.etime || '',
          onlySellerQr: $scope.isChecked ? 1 : 0,
          pageNo: page || 1,
          pageSize: 10
        };

        $model.orderGetList(data).then(function(res) {
          if(res.data.ok) {
            $scope.vm.listData = res.data.data.list || [];

            // 是否刷新页码
            if(ispage) {
              $scope.paginationConf = res.data;
              // 因为接口文档定义的字段和原来写的字段不一致，所以这里改变下。
              $scope.paginationConf.data.page.currentPageNumber =  res.data.data.page.pageNo; // 当前页
              $scope.paginationConf.data.page.pageNumber =  res.data.data.page.pageCount; // 页数
            }
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        })
      }

      // 刚进入页面
      getList(1, true);

      // 搜索
      $scope.search = function () {
        getList(1, true);
      }

      // 重置
      $scope.reset = function () {
        $scope.vm = {
          status: '',
          searchType: 1, // 关键词类型
          keywords: '',
          stime: '',
          etime: '',
          pageNo: 1,
          pageSize: 10
        }
        $('#brand').multiselect('refresh');
        $('#spec').multiselect('refresh');
        $('#region').multiselect('refresh');
        getList(1, true);
      }

      // 仅显示店码订单
      $scope.storeCodeClick = function () {
        if($scope.isChecked) {
          $scope.isChecked = false;
        } else {
          $scope.isChecked = true;
        }
        getList(1, true);
      }

      // 导出待收货订单
      $scope.export = function () {
        var data = {
          status: $scope.vm.status || '',
          searchType: $scope.vm.searchType || '', // 关键词
          keywords: $scope.vm.keywords || '', // 关键词
          stime: $scope.vm.stime || '',
          etime: $scope.vm.etime || '',
          onlySellerQr: $scope.isChecked ? 1 : 0,
          filename: '',
        };

        var url = '/api/tztx/seller-manager/order/exportOrders';
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        for(var attr in data) {
          formData.append(attr, data[attr]);
        }
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.open('POST', url, true);
        xhr.responseType = "blob";
        xhr.responseType = "arraybuffer"
        xhr.setRequestHeader("token", sessionStorage.getItem('access_token'));
        xhr.setRequestHeader("loginId", sessionStorage.getItem('access_loginId'));
        xhr.onload = function(res) {
          if (this.status == 200) {
            alertMsg($('#newAlert'), 'success', '导出成功');
            var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});
            var respHeader = xhr.getResponseHeader("Content-Disposition");
            var fileName = decodeURI(respHeader.match(/filename=(.*?)(;|$)/)[1]);
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          } else {
            alertMsg($('#newAlert'), 'danger', res.data.msg);
          }
        };
        xhr.send(formData);
      }

      // $scope.import = function () {
      //   console.log(123)
      // }

      // 导入订单
      $('#importFile').change(function(){
        var importFile = $('#importFile')[0].files[0];
        if(importFile != undefined){
          var formData = new FormData();
          formData.append('file',importFile);
          $.ajax({
            url: '/api/tztx/seller-manager/order/readOrderData',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
              ContentType: "multipart/form-data",
              loginId : sessionStorage.access_loginId,
              token : sessionStorage.access_token
            }
          }).done(function(res) {
            getList(1, true);
            alertMsg($('#newAlert'), 'success', '导入成功');
            $scope.importTitle = '导入成功';
          }).fail(function(res) {
            alertMsg($('#newAlert'), 'danger', '导入失败');
          });
        }
      });


      // 查看详情
      $scope.viewDetial = function () {
        // 重置验证
        $scope.vm.order = '';
        $scope.orderForm.$setPristine();
        $scope.orderForm.$setUntouched();
      }



      // 弹窗框
      var alertMsg = function(e, t, i) { // e为元素，t为类型，i为信息
        var promptCon = e.clone();

        if(t == 'success') { // 成功
          e.addClass('alert-success');
        } else if(t == 'warning') { // 警告
          e.addClass('alert-warning');
        } else if(t == 'danger') { // 错误
          e.addClass('alert-danger');
        }

        e.find('.prompt').text(i || '请求错误请重试');
        e.show().addClass('in');

        // 克隆的再放进body
        e.on('closed.bs.alert', function () {
          $('body').append(promptCon);
        })

        // 3秒后隐藏
        var alertHide = $timeout(function(){
          e.alert('close')
        }, 3000)

        e.hover(function() {
          $timeout.cancel(alertHide);
        }, function() {
          // 3秒后隐藏
          var alertHide = $timeout(function(){
            e.alert('close')
          }, 3000)
        })
      }

      // 监视paginationConf变化更新page
      $scope.$watch('paginationConf', function () {
        // 属性赋值
        if ($scope.paginationConf && $scope.paginationConf.data) {
          var page = $scope.paginationConf.data.page;
          $scope.totalCount = page.count;
          $scope.size = page.count - page.start > page.pageSize ? page.pageSize : page.count - page.start;
          $scope.curPage = page.currentPageNumber; // 当前页
          $scope.pageNumber = page.pageNumber; // 页数
        }
      }, true);

      // 分页点击
      $scope.$on('frompagechange', function (e, v, f) {
        getList(f.currentPageNumber, true);
      })

      // 时间设置
      $("#durationStart").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var stime = e.target.value;
        var etime = $scope.vm.etime;
        if (etime < stime) {
          $scope.vm.etime = '';
          $scope.$apply();
        }
      });

      $("#durationEnd").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:00',
        language: 'zh-CN',
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1
      }).on('change', function (e) {
        var etime = e.target.value;
        var stime = $scope.vm.stime;
        if (stime > etime) {
          $scope.vm.stime = '';
          $scope.$apply();
        }
      });

    }]
  };
  return visitOrderManageCtrl;
})
