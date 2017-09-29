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
        $scope.master = {}; //初始化新建卷烟的表单

        var scope_conf = function (selector) {
          var scope = angular.element(selector).scope();
          return scope ? scope.conf ? scope.conf : scope.conf = {} : false;
        }

        var scope = function (selector) {
          return angular.element(selector).scope()
        }

  			// 获取列表数据
        var getList = function(data) {
          if (data) {
            data.status = 1;
          } else {
            var data = {};
            data.status = 1
          }
          $model.getlist(data).then(function (res) {
            $scope.cigarettelistConf = res.data;
            $scope.paginationConf = res.data;
          })
        }
        getList()

        $scope.$on('frompagechange', function (e,v,f) {
          getList(f)
        })

        // 搜索
        $scope.search = function () {
          var data = {
            sn: $scope.sn || '',
            brandCode: $scope.brandCode || '',
            grade: $scope.grade || '',
            pack: $scope.pack || '',
            minPrice: $scope.minprice || '',
            maxPrice: $scope.maxprice || ''
          }
          getList(data)
        }

        // 重置
        $scope.searchreset = function () {
          $scope.searchForm.$setPristine();
          $scope.searchForm.$setUntouched();
          $scope.brandCode = '';
          $scope.grade = '';
          searchForm.reset();
          getList()
        }
        
        // 新建卷烟里面选择品牌
        $scope.$on('choosebrands', function(e,v,f) {
          $model.getbrands().then(function(res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').brandlist = data;
            $scope.brandlist = data;
          })
        })

        $(document).ready(function () {
          $(".operation.multi .select").multiselect({
            includeSelectAllOption: true,
            nonSelectedText: '请选择',
            selectAllText: '全部',
            nSelectedText: '已选择',
            selectAllValue: 'all',
            enableFiltering: true,
            buttonWidth: '100%',
            maxHeight: '200px',
            numberDisplayed: 1
          });
        });

        // 操作面板 获取品牌
        $model.getbrands().then(function(res) {
          $scope.brandlist = res.data.data;
          $('[ng-model="brandCode"]').multiselect('dataprovider', _.forEach($scope.brandlist, function(v){
              v.label = v.name;
              v.value = v.brandCode;
          }));
          $('[ng-model="brandCode"]').multiselect('refresh');
        })

        // 操作面板，根据品牌获取规格
        $scope.$watch('brandCode', function(n, o, s) {
          if (n !== '') {
            $scope.brandCode = n;
            var brandListArrObj = {};
            brandListArrObj.brandCode = n;
            $model.getsns(brandListArrObj).then(function (res) {
              $scope.sn = res.data.data;
              $('[ng-model="sn"]').multiselect('dataprovider', _.forEach($scope.sn, function(v){
                v.label = v.name;
                v.value = v.sn;
              }));
              $('[ng-model="sn"]').multiselect('refresh');
            })
          }
        })


        // 卷烟类型
        $scope.$on('cigarettestyle', function (e,v,f) {
          $model.checkstyle().then(function (res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').stylelist = data;
          })
        })

        // 包装单位
        $scope.$on('cigarettetype', function (e,v,f) {
          $model.checktype().then(function (res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').typelist = data;
          })
        })

        // 包装
        $scope.$on('cigarettepack', function (e,v,f) {
          $model.checkpack().then(function (res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').packlist = data;
            $scope.packlist = data;
          })
        })

        // 价类
        $scope.$on('cigarettegrade', function (e,v,f) {
          $model.checkgrade().then(function (res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').gradelist = data;
            $scope.gradelist = data;
          })
        })

        // 二级价类
        $scope.$on('gradechange', function (e, v, f) {
          $model.checkgrade(f).then(function (res) {
            var data = res.data.data;
            scope_conf('.create-cigarette-body').gradelistjunior = data;
          })
        })

        // 执行初始化(查询、保存、取消)
        function init(bool) {
          if (scope_conf('.create-cigarette-body')) {
            if (bool) {
              // 保存 和 取消
              $scope.form.$setPristine();
              $scope.form.$setUntouched();
              scope_conf('.create-cigarette-body').ciga = angular.copy($scope.master);
              scope_conf('.create-cigarette-body').snData = null;
              scope_conf('.create-cigarette-body').disabled = true;
              $('[data-dismiss="modal"]').trigger('click');
              form.reset();
              searchForm.reset();
              getList()
            } else {
              // 查询没有结果
              var sn = scope('.create-cigarette-body').ciga.product.sn;
              var brandCode = scope('.create-cigarette-body').ciga.product.brandCode;
              scope_conf('.create-cigarette-body').ciga =  angular.copy($scope.master);
              scope_conf('.create-cigarette-body').ciga.product = {
                type: 1
              };
              scope_conf('.create-cigarette-body').ciga.product.sn = sn;
              scope_conf('.create-cigarette-body').ciga.product.brandCode = brandCode;
            }
          }
        }

        // 查询sn
        $scope.$on('checksn', function (e,v,f) {
          $model.checksn(f).then(function(res) {
            if (res.data.data) {
              scope_conf('.create-cigarette-body').disabled = true;
              scope_conf('.create-cigarette-body').checked = true;
              scope_conf('.create-cigarette-body').ciga = scope_conf('.create-cigarette-body').snData = res.data.data;
            } else {
              scope_conf('.create-cigarette-body').disabled = false;
              init(false)
            }
          })
        })

        // 保存卷烟
        $scope.save = function () {
          if (scope('.create-cigarette-body').form.$valid) {
            var snData  = scope_conf('.create-cigarette-body').snData;
            if (snData) {
              $model.save(snData).then(function (res) {
                init(true);
              })
            } else {
              var data = scope_conf('.create-cigarette-body').ciga;
              if (data && !$.isEmptyObject(data)) {
                data.activeDays = data.activeDays || 5;
                data.num = data.num || 10;
                $model.save(data).then(function (res) {
                  init(true);
                })
              } else {
                alert('请确保必填内容已填写再提交')
                return
              }
            }
          } else {
            alert('请确保必填内容已填写再提交')
            return
          }
        }

        // 取消
        $scope.cancel = function() {
          var r = confirm('确定要取消吗？')
          if (r == true) {
            init(true)
          } else {
            return
          }
        };

        // 修改
        $scope.$on('edit', function (e,v,f) {
          $model.checksn(f).then(function(res) {
            if (res.data.data) {
              $('[data-target=".create-modal"]').trigger('click');
              scope_conf('.create-cigarette-body').checked = false; //判断是否可以选择图片的标识
              scope_conf('.create-cigarette-body').ciga = scope_conf('.create-cigarette-body').snData = res.data.data;
              scope_conf('.create-cigarette-body').disabled = false;
            } 
          })
        })

        // 删除
        $scope.$on('delete', function (e, v, f) {
          $model.delete(f).then(function (res) {
            getList()
          })
        })

        // 上传图片
        $scope.$on('image', function (e,v,f) {
          $.ajax({
            url: '/api/tztx/saas/saotx/attach/commonAliUpload',
            type: 'POST',
            cache: false,
            data: f,
            processData: false,
            contentType: false,
            headers: {
                ContentType: "multipart/form-data",
                loginId : sessionStorage.access_loginId,
                token : sessionStorage.access_token
            }
          }).done(function (res) {
            var data = res.data;
            var fileSuccessData = res.data;
            scope_conf('.create-cigarette-body').ciga.product.smallPic = fileSuccessData.accessUrl; //图片保存地址    
          }).fail(function (res) {
            alert('文件上传失败，请重试');
            return
          })
        })

    	}]
  	}
  	return cigarettemanageController
})