var fs = require('fs');
var Hogan = require('hogan.js');
var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var fs = require('fs');
var IndexHtmlTemplate = Hogan.compile(fs.readFileSync('./views/index.hjs', 'utf-8'));
var fsp = require('fs-promise');

var planToObjectForSelectOption = function(plan)
{
    var amount = ((new Decimal(plan.amount)).div(100).toString());
    var description = plan.name;
    if (plan.name.toLowerCase().trim() === 'basic')
    {
        description += '-25';
    }
    description += ' Bidders: $'+amount;

    return {
        id:plan.id,
        description:description,
    };
      // {{name}} Bidders: ${{amount}}
};

var renderIndexHtmlOnStartUp = function() {

  return function(stripePlansPromise)
  {
      stripePlansPromise.then(function(result) {

          var planOptions = result.data.map(planToObjectForSelectOption);

          var indexHtmlPromise = fsp.writeFile('./public/index.html', IndexHtmlTemplate.render({
              planOptions: planOptions
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
