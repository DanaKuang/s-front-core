/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: config
 */

// 异步非阻塞加载依赖包

requirejs.config({
  baseUrl: '/statics',
  waitSeconds: 0,
  paths: {
    jquery: [
      'https://cdn.bootcss.com/jquery/3.2.1/jquery.min',
      'bower_components/jquery/dist/jquery'
    ],
    lodash: [
      'https://cdn.bootcss.com/lodash.js/3.10.1/lodash.min',
      'bower_components/lodash/lodash'
    ],
    d3: [
      'https://cdn.bootcss.com/d3/4.9.1/d3.min',
      'bower_components/d3/d3'
    ],
    bootstrap: [
      'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min',
      'bower_components/bootstrap/dist/js/bootstrap'
    ],
    datetimepicker: [
      'https://cdn.bootcss.com/smalot-bootstrap-datetimepicker/2.4.4/js/bootstrap-datetimepicker.min',
      'bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker'
    ],
    bootstrapMultiselect: [
      'https://cdn.bootcss.com/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.min',
      'bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect'
    ],
    echarts: [
      // 'https://cdn.bootcss.com/echarts/3.6.2/echarts.min',
      'bower_components/echarts/dist/echarts'
    ],
    angular: [
      // 'https://cdn.bootcss.com/angular.js/1.3.20/angular.min',
      'bower_components/angular/angular'
    ],
    angularAnimate: [
      'https://cdn.bootcss.com/angular.js/1.3.20/angular-animate.min',
      'bower_components/angular-animate/angular-animate'
    ],
    angularFileUpload: [
      'https://cdn.bootcss.com/angular-file-upload/2.5.0/angular-file-upload.min',
      'bower_components/angular-file-upload/dist/angular-file-upload.min'
    ],
    app: 'app/app'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    lodash: {
      exports: '_'
    },
    d3: {
      exports: 'd3'
    },
    bootstrap: {
      deps: ['jquery']
    },
    datetimepicker: {
      deps: ['jquery']
    },
    bootstrapMultiselect: {
      deps: ['jquery']
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
    app: {
      deps: [
        'datetimepicker'
      ]
    }
  },
  deps: [
    'jquery',
    'lodash',
    'd3',
    'bootstrap',
    'datetimepicker',
    'bootstrapMultiselect',
    'echarts',
    'angular',
    'angularAnimate',
    'angularFileUpload'
  ],
  callback: function() {
    require(['app']); //引导应用初始化
  }
});
