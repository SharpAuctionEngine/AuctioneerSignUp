var Promise = require('es6-promise').Promise;

var subscribeToStripe = function (stripePlan, stripeToken, email, stripeAPI) {

  return new Promise(function (resolve, reject) {
    stripePlan.then(function (plan) {
      console.log({
        plan: plan.id,
        stripeToken: stripeToken,
        msg: 'making CustomerPromise'
      });
      var customerPromise = stripeAPI.customers.create({
        description: email,
        source: stripeToken, // obtained with Stripe.js
        plan: plan.id
      });
      // console.log({
      //   customerPromise: customerPromise
      // });

      customerPromise.then(resolve,reject).catch(reject);
      customerPromise.then(function (result) {

        console.log({
          customerPromise: result
        });
      });
      customerPromise.catch(function (result) {

        console.log({
          customerPromiseErr: result
        });
      });
    }).catch(function (err) {
      reject(err);
    });
  });
};

module.exports = subscribeToStripe;
