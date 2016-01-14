var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var mapMetaDataForStripe = require('./mapMetaDataForStripe');


// @todo cache a map of stripeToken::
var subscribeToStripe = function(stripePlan, userRequestRaw, stripeAPI)
{
  return new Promise(function(resolve, reject) {
    stripePlan.then(function(plan) {
      console.log({
        plan:        plan.id,
        stripeToken: userRequestRaw.stripeToken,
        msg:         'making CustomerPromise'
      });
      var customerPromise = stripeAPI.customers.create({
        description: userRequestRaw.auction_house_name,
        email:       userRequestRaw.email,
        source:      userRequestRaw.stripeToken, // obtained with Stripe.js
        plan:        plan.id,
        metadata:    mapMetaDataForStripe(userRequestRaw)
      });

      customerPromise.then(resolve, reject).catch(reject);

      // dumpPromise('customerPromise',customerPromise);

    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports = subscribeToStripe;
