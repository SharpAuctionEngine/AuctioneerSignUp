var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');
var mapMetaDataForStripe = require('./mapMetaDataForStripe');

var subscribeToStripe = function(stripePlan, userRequestRaw, stripeAPI)
{
  var stripeToken = userRequestRaw.stripeToken;
  var email = userRequestRaw.email;

  return new Promise(function(resolve, reject) {
    stripePlan.then(function(plan) {
      console.log({
        plan: plan.id,
        stripeToken: stripeToken,
        msg: 'making CustomerPromise'
      });
      var customerPromise = stripeAPI.customers.create({
        description: email,
        email: email,
        source: stripeToken, // obtained with Stripe.js
        plan: plan.id,
        metadata: mapMetaDataForStripe(userRequestRaw)
      });
      // console.log({
      //   customerPromise: customerPromise
      // });

      customerPromise.then(resolve, reject).catch(reject);

      // dumpPromise('customerPromise',customerPromise);

    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports = subscribeToStripe;
