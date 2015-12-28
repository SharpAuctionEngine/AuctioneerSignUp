require('dotenv').config({path: './.env'});

var stripeAPI = require("stripe")("sk_test_qNt8nbmpti7cUDTSpSwrQoQJ");
var getStripePlans = require('../lib/getStripePlans')(stripeAPI);
var dumpPromise = require('../lib/debug/dumpPromise');
var Decimal = require('decimal.js');

var stripePlansPromise = getStripePlans();

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

// dumpPromise('stripePlansPromise ',stripePlansPromise);
