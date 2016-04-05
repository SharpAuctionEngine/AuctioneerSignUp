var Promise = require('es6-promise').Promise;


var byLowestAmountFirst = function (a, b) {
    if (a.amount < b.amount) {
        return -1;
    }
    if (a.amount > b.amount) {
        return 1;
    }
    return 0;
};

var getStripePlans = function (stripeAPI) {

    return function () {
        return new Promise(function (resolve, reject) {
            var stripePromise = stripeAPI.plans.list({
                limit: 100
            });

            stripePromise.then(function (result) {
                result.data = result.data.sort(byLowestAmountFirst);

                resolve(result);

            }, reject);
        });
    };

};

module.exports = getStripePlans;