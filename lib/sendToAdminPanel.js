var Promise = require('es6-promise').Promise;
var rp = require('request-promise');
// var curlify = require('request-as-curl');
// var dumpPromise = require('./debug/dumpPromise');
var array_dot = require('./array_dot');

var sendToAdminPanel = function(dbPromise, password, plan_key) {

  return new Promise(function(resolve, reject) {
    dbPromise.then(function(dbData) {

      var base_uri = process.env.ADMIN_PANEL_BASE_URI;

      var options = {
        uri: base_uri+'/api/v1.0/houses/add',
        method: 'POST',
        json: true,
	headers: {
                 'Auth-token': process.env.AUTH_TOKEN,
        },

        body: dbData
      };

      var response = rp(options);

      response.then(resolve, reject).catch(reject);

      response.then(null,function(apResponse){
        if (apResponse.statusCode===400)
        {
            if (apResponse.error && apResponse.error.errors)
            {
                console.log(array_dot(apResponse.error,'sendToAdminPanel.responseError'));
            }
            // @todo let the user know
        }
        else
        {
            // @todo let the user know
            // @todo rollbar
        }
      });

    }).catch(function(err) {
      reject(err);
    });
};

module.exports = sendToAdminPanel;
