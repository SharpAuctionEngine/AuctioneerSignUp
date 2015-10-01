
var Promise = require('es6-promise').Promise;

var sendToAdminPanel=function(dbPromise)
      {      console.log('sendToAdminPanel();');
           return new Promise(function(resolve, reject){
          dbPromise.then(function(ApPromise)
              {
                
                  // rp('http://45.79.216.73/api/v1.0/houses/add')
                  //    .then(console.dir)
                  //    .catch(console.error);

                      var options = {
                      uri : 'http://45.79.216.73/api/v1.0/houses/add',
                      method : 'POST',
                      json: true,
                      body: { some: 'insertToPostgre' }
                        };

                rp(options)
                .then(console.dir)
                .then(resolve)

                .catch(console.error)
                .catch(reject);

                })
          .catch(console.error)
          .catch(reject);
        });
        }
        module.exports = sendToAdminPanel;