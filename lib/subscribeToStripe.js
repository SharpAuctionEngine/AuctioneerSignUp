var Promise = require('es6-promise').Promise;
var mapMetaDataForStripe = require('./mapMetaDataForStripe');


// @todo cache a map of stripeToken::
var subscribeToStripe = function (stripePlan, userRequestRaw, stripeAPI, cacheRedis) {
    return new Promise(function (resolve, reject) {
        stripePlan.then(function (plan) {
            console.log({
                plan: plan.id,
                stripeToken: userRequestRaw.stripeToken,
                msg: 'making CustomerPromise'
            });

            var cacheKey = 'token2customer:' + userRequestRaw.stripeToken;
            cacheRedis.get(cacheKey, function (err, data) {
                if (err || data !== null) {
                    console.log('exists');
                    reject('Token used more than once');
                } else {
                    // console.log('doesn\'t exist');
                    stripeAPI.customers.create({
                        description: userRequestRaw.auction_house_name,
                        email: userRequestRaw.email,
                        source: userRequestRaw.stripeToken, // obtained with Stripe.js
                        plan: plan.id,
                        metadata: mapMetaDataForStripe(userRequestRaw)
                    }).then(function (stripeCustomer) {
                        var stripeCustomerJson = JSON.stringify(stripeCustomer);
                        cacheRedis.pipeline().set(cacheKey, stripeCustomerJson).exec(); // caching the json object 
                        resolve(stripeCustomer);
                    });
                }
            });
            // customerPromise.then(resolve, reject).catch(reject);

            // dumpPromise('customerPromise',customerPromise);

        }).catch(function (err) {
            reject(err);
        });
    });
};

module.exports = subscribeToStripe;