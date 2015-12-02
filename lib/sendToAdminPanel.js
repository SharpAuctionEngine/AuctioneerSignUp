var Promise = require('es6-promise').Promise;
var rp = require('request-promise');
// var curlify = require('request-as-curl');
var dumpPromise = function(name,promise)
{
    promise.then(function(result)
    {
        console.log(name+':resolve');
        console.log(result);
    },function(result)
    {
        console.log(name+':reject');
        console.warn(result);
    }).catch(function(result)
    {
        console.log(name+':catch');
        console.error(result);
    });
};

var sendToAdminPanel = function(dbPromise, password, plan_key) {

    return new Promise(function(resolve, reject) {
        dbPromise.then(function(dbData) {

            

            var options = {
                uri: 'http://kt:python@45.79.216.73/api/v1.0/houses/add',
                method: 'POST',
                json: true,
                body: dbData
            };

            var response = rp(options)
                // .then(console.dir,console.dir)
                 dumpPromise('response',response);

                

            response.then(resolve, reject).catch(reject);
            
            
        }).catch(function(err) {
            reject(err)
        });
    });
};

module.exports = sendToAdminPanel;