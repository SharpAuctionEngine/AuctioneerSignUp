var fs = require('fs');
var Hogan = require('hogan.js');
var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var ProPlanTemplate = Hogan.compile(fs.readFileSync('./views/proplan_template.hjs', 'utf-8'));

var renderIndexHtmlOnStartUp = function() {

  return function(stripePlansPromise)
  {
      stripePlansPromise.then(function(result) {

        ProPlanTemplate.render({
          options: result.data

        });
      });
  };

};

module.exports = renderIndexHtmlOnStartUp;