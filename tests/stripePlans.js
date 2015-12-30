require('dotenv').config({path: './.env'});

var stripeAPI = require("stripe")("sk_test_qNt8nbmpti7cUDTSpSwrQoQJ");
var getStripePlans = require('../lib/getStripePlans')(stripeAPI);
var dumpPromise = require('../lib/debug/dumpPromise');
var Decimal = require('decimal.js');

var stripePlansPromise = getStripePlans();

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

stripePlansPromise.then(function(results)
{
    // var plans = results.data.map(function(plan)
    // {
    //     return {
    //         id:   plan.id,
    //         name: plan.name,
    //     };
    // });
    // console.log(plans);

    var planOptions = results.data.map(planToObjectForSelectOption);
    console.log(planOptions);

    // console.log(results.data[3]);


});

var renderIndexHtmlOnStartUp = require('../lib/renderIndexHtmlOnStartUp')();
renderIndexHtmlOnStartUp(getStripePlans());

// dumpPromise('stripePlansPromise ',stripePlansPromise);
