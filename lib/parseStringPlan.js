var Promise = require('es6-promise').Promise;

var parseStringPlan = function(stripePlansPromise, name, bidders) {

  return new Promise(function(resolve, reject) {
    stripePlansPromise.then(function(result) {

      // var plans = result.data.map(function(plan){
      //     return {
      //       name:plan.name,
      //       id:plan.id,
      //     };

      // });
      var plans = result.data;

      var plan_name = (name + '-' + bidders).toLowerCase();

      // console.log({plan_name:plan_name,name:name,bidders:bidders});

      var matchingPlans = plans.filter(function(e, i, a) {

        if (e.name.toLowerCase() === plan_name) {

          return true;
          // console.log({match:1,plan_name:plan_name,plan:e});
        } else {

          return false; // console.log({match:'basic',plan_name:plan_name,plan:e});
        }
        // return false;
      });

      if (matchingPlans.length == 1) {
        return resolve(matchingPlans[0]);
        // console.log(matchingPlans[0]);
      }
      var basicPlans = plans.filter(function(e, i, a) {
        if (e.name.toLowerCase() === 'basic') {

          return true;
        } else {
          return false;
          // console.log('basic false');
        }

        // todo
        resolve(basicPlans[0]);
      });


      // 

      reject('invalid_plan');
      // resolve('plan_id');

    }, function(err) {

      reject(err);
    });
  });
}

module.exports = parseStringPlan
