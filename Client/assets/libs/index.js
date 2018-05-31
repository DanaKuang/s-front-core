/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: config
 */

// 异步非阻塞加载依赖包
var SAO_CDN_URL = 'https://weiopn.oss-cn-beijing.aliyuncs.com/pc_data_front/';

requirejs.config({
  baseUrl: '/statics',
  waitSeconds: 0,
  map: {
    '*': {
      'css': 'bower_components/require-css/css.min'
    }
  },
  paths: {
    jquery: [
      SAO_CDN_URL + 'js/jquery.min',
      'bower_components/jquery/dist/jquery'
    ],
    md5: [
      'https://weiopn.oss-cn-beijing.aliyuncs.com/common/md5'
    ],
    lodash: [
      SAO_CDN_URL + 'js/lodash.min',
      'bower_components/lodash/lodash'
    ],
    bootstrap: [
      SAO_CDN_URL + 'js/bootstrap.min',
      'bower_components/bootstrap/dist/js/bootstrap'
    ],
    datetimepicker: [
      SAO_CDN_URL + 'js/bootstrap-datetimepicker.min',
      'bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker'
    ],
    bootstrapMultiselect: [
      SAO_CDN_URL + 'js/bootstrap-multiselect',
      'bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect'
    ],
    echarts: [
      SAO_CDN_URL + 'js/echarts.min',
      'bower_components/echarts/dist/echarts'
    ],
    angular: [
      // SAO_CDN_URL + 'js/angular.min',
      'bower_components/angular/angular'
    ],
    angularAnimate: [
      SAO_CDN_URL + 'js/angular-animate.min',
      'bower_components/angular-animate/angular-animate'
    ],
    angularFileUpload: [
      SAO_CDN_URL + 'js/angular-file-upload.min',
      'bower_components/angular-file-upload/dist/angular-file-upload.min'
    ],
    zTree: [
      SAO_CDN_URL + 'js/jquery.ztree.all.min',
      'bower_components/zTree/js/jquery.ztree.all'
    ],
    nprogress: [
      SAO_CDN_URL + 'js/nprogress',
      'bower_components/nprogress/nprogress'
    ],
    app: 'app/app'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    md5: {
      exports: '$.md5',
      deps: [
        'jquery'
      ]
    },
    lodash: {
      exports: '_'
    },
    bootstrap: {
      deps: [
        'jquery',
        'css!' + SAO_CDN_URL + 'css/animate.min',
        'css!bower_components/font-awesome/css/font-awesome.min',
        'css!bower_components/bootstrap/dist/css/bootstrap.min'
      ]
    },
    datetimepicker: {
      deps: [
        'jquery',
        'css!' + SAO_CDN_URL + 'css/datetimepicker.min'
      ]
    },
    bootstrapMultiselect: {
      deps: [
        'jquery',
        'css!' + SAO_CDN_URL + 'css/bootstrap-multiselect'
      ]
    },
    angular: {
      deps: ['jquery'],
      exports: 'angular'
    },
    echarts: {
      exports: 'echarts'
    },
    angularAnimate: {
      deps: ['angular']
    },
    angularFileUpload: {
      deps: ['angular']
    },
    zTree: {
      deps: [
        'jquery',
        'css!' + SAO_CDN_URL + 'css/zTreeStyle/zTreeStyle'
      ]
    },
    nprogress: {
      deps: [
        'jquery',
        'css!' + SAO_CDN_URL + 'css/nprogress'
      ]
    },
    app: {
      deps: [
        'datetimepicker',
        'css!assets/style/common',
        'css!assets/style/style'
      ]
    }
  },
  deps: [
    'jquery',
    'md5',
    'lodash',
    'bootstrap',
    'datetimepicker',
    'bootstrapMultiselect',
    'echarts',
    'angular',
    'angularAnimate',
    'angularFileUpload',
    'zTree',
    'nprogress'
  ],
  callback: function() {
    // debugger
    require(['app']); //引导应用初始化
  }
});
