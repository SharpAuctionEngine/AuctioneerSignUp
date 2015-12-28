var fs = require('fs');
var Hogan = require('hogan.js');
var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var fs = require('fs');
var IndexHtmlTemplate = Hogan.compile(fs.readFileSync('./views/index.hjs', 'utf-8'));
var fsp = require('fs-promise');

var renderIndexHtmlOnStartUp = function() {

  return function(stripePlansPromise)
  {
      stripePlansPromise.then(function(result) {

          var indexHtmlPromise = fsp.writeFile('./public/index.html', IndexHtmlTemplate.render({
              options: result.data
          }),'utf-8');

          indexHtmlPromise.then(function(result)
          {
              console.log('index.html written successfully');
          },function(err){
              console.log('Could not write to index.html');
              throw new Error(err);
          });
      });
  };

};

module.exports = renderIndexHtmlOnStartUp;
