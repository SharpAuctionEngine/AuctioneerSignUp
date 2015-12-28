var Promise = require('es6-promise').Promise;
var rp = require('request-promise');
// var curlify = require('request-as-curl');
var dumpPromise = require('./debug/dumpPromise');

var sendToAdminPanel = function(dbPromise, password, plan_key) {

  return new Promise(function(resolve, reject) {
    dbPromise.then(function(dbData) {



      var options = {
        uri: 'http://kt:python@45.79.216.73/api/v1.0/houses/add',
        method: 'POST',
        json: true,
        body: dbData
      };

      var response = rp(options);

      // dumpPromise('response', response);

      response.then(resolve, reject).catch(reject);


    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports = sendToAdminPanel;
