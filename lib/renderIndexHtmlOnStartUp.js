var fs = require('fs');
var Decimal = require('decimal.js');
var Hogan = require('hogan.js');
var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var IndexHtmlTemplate = Hogan.compile(fs.readFileSync('./views/index.hjs', 'utf-8'));
var fsp = require('fs-promise');

var instanceParentDomain = process.env.INSTANCE_PARENT_DOMAIN || 'sae.bid';
var stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
var minimumDomainLength = process.env.MINIMUM_INSTANCE_DOMAIN;
var salesForceInstance =process.env.SALESFORCE_INSTANCE;
var rollbarClientKey = process.env.ROLLBAR_CLIENT_KEY;
var rollbarEnv = process.env.ROLLBAR_ENV;

var planToObjectForSelectOption = function (plan) {
    var amountDecimal = ((new Decimal(plan.amount)).div(100).toString());
    var description = plan.name;
    var bidders = 25;
    if (plan.name.toLowerCase().trim() === 'basic') {
        description += '-25';
    } else {
        var parts = plan.name.toLowerCase().split('-');
        bidders = parts[1];
    }
    description += ' Bidders: $' + amountDecimal;

    return {
        id: plan.id,
        description: description,
        amountInteger: plan.amount,
        amountDecimal: amountDecimal,
        bidders: bidders
    };
    // {{name}} Bidders: ${{amount}}
};

var renderIndexHtmlOnStartUp = function () {

    return function (stripePlansPromise) {
        stripePlansPromise.then(function (result) {

            var planOptions = result.data.map(planToObjectForSelectOption);
            var indexHtmlPromise = fsp.writeFile('./public/auctioneer-signup/index.html', IndexHtmlTemplate.render({
                planOptions: planOptions,
                planOptionsJson: JSON.stringify(planOptions),
                instanceParentDomain: instanceParentDomain,
                minimumDomainLength: minimumDomainLength,
                stripePublishableKey: stripePublishableKey,
                salesForceInstance: salesForceInstance,
                rollbarClientKey: rollbarClientKey,
                rollbarEnv: rollbarEnv,
                termsConditionsModalHtml: fs.readFileSync('./public/auctioneer-signup/terms_and_conditions.html', 'utf-8') || '',
                privacyPolicyModalHtml: fs.readFileSync('./public/auctioneer-signup/privacy_policy.html', 'utf-8') || ''
            }), 'utf-8');

            // dumpPromise('indexHtmlPromise',indexHtmlPromise);

            indexHtmlPromise.then(function (result) {
                console.log('index.html written successfully');
            }, function (err) {
                console.log('Could not write to index.html');
                throw new Error(err);
            });
        });
    };

};

module.exports = renderIndexHtmlOnStartUp;
