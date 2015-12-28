var Promise = require('es6-promise').Promise;
var dumpPromise = require('./debug/dumpPromise');

var getStripePlans = function(stripeAPI) {

  return function()
  {
      return stripeAPI.plans.list({
        limit: 64
      });
  };

};

module.exports = getStripePlans;
