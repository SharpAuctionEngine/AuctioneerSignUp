var Promise = require('es6-promise').Promise;
require('array.prototype.find');//es6polyfill

var wherePlanId = function(plan_id)
{
    return function(plan)
    {
        return plan.id === plan_id;
    };
};

var parseStringPlan = function(stripePlansPromise, plan_id)
{
    return new Promise(function(resolve, reject)
    {
        stripePlansPromise.then(function(result)
        {
            var plan = result.data.find(wherePlanId(plan_id));

            if (plan)
            {
                return resolve(plan);
            }

            return reject('invalid_plan');

        }, function(err)
        {
            reject(err);
        });
    });
};

module.exports = parseStringPlan;
