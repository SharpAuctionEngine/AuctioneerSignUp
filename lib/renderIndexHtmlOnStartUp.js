var fs = require('fs');
var Decimal = require('decimal.js');
var Hogan = require('hogan.js');
var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var fs = require('fs');
var IndexHtmlTemplate = Hogan.compile(fs.readFileSync('./views/index.hjs', 'utf-8'));
var fsp = require('fs-promise');

var planToObjectForSelectOption = function(plan)
{
    var amountDecimal = ((new Decimal(plan.amount)).div(100).toString());
    var description = plan.name;
    var bidders = 25;
    if (plan.name.toLowerCase().trim() === 'basic')
    {
        description += '-25';
    }
    else
    {
        var parts = plan.name.toLowerCase().split('-');
        bidders = parts[1];
    }
    description += ' Bidders: $'+amountDecimal;

    return {
        id:plan.id,
        description:description,
        amountInteger:plan.amount,
        amountDecimal:amountDecimal,
        bidders:bidders,
    };
      // {{name}} Bidders: ${{amount}}
};

var renderIndexHtmlOnStartUp = function() {

  return function(stripePlansPromise)
  {
      stripePlansPromise.then(function(result) {

          var instanceParentDomain = process.env.INSTANCE_PARENT_DOMAIN||'sae.bid';
          var stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
          var planOptions          = result.data.map(planToObjectForSelectOption);
          var indexHtmlPromise     = fsp.writeFile('./public/index.html', IndexHtmlTemplate.render({
              planOptions: planOptions,
              planOptionsJson: JSON.stringify(planOptions),
              instanceParentDomain: instanceParentDomain,
              stripePublishableKey:stripePublishableKey,
          }),'utf-8');

          // dumpPromise('indexHtmlPromise',indexHtmlPromise);

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
