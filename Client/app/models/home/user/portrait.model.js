define([], function () {
    var portraitModel = {
      ServiceType: 'service',
      ServiceName: 'PortraitViewModel',
      ServiceContent: ['request', function (request) {
        this.$model = function () {
            console.log("portrait is under Model")
        };
      }]
    };
  
    return portraitModel;
  });