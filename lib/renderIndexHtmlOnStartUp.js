var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');

var renderIndexHtmlOnStartUp = function(stripePlansPromise) {

  stripePlansPromise.then(function(result) {

    ProPlanTemplate.render({
      options: result.data

    });
  });

};

module.exports = renderIndexHtmlOnStartUp;
