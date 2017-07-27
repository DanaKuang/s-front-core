/**
 *
 */

define([], function() {
  /**
   * [buildService description]
   * @param  {[type]} module [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  function buildService(module, params) {
    angular.forEach(params, function(d) {
      if (angular.isArray(d)) {
        buildService(module, d);
      } else if(!!d) {
        if (d.ViewModelName) {
          d.ServiceContent.$model = d.ViewModelName;
        }
        module[d.ServiceType](d.ServiceName, d.ServiceContent);
      }
    });
  }
  return {
      done: buildService
  };
});
