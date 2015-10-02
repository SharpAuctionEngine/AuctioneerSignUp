var Promise = require('es6-promise').Promise;
var rp = require('request-promise');

var sendToAdminPanel = function (dbPromise) {
  console.log('sendToAdminPanel();');
  return new Promise(function (resolve, reject) {
    dbPromise.then(function (/*dbPromiseResult*/) {

        // rp('http://45.79.216.73/api/v1.0/houses/add')
        //    .then(console.dir)
        //    .catch(console.error);

        var options = {
          uri: 'http://45.79.216.73/api/v1.0/houses/add',
          method: 'POST',
          json: true,
          body: {
            some: 'insertToPostgre'
          }
        };

        rp(options)
          .then(console.dir,console.dir)
          .then(resolve,reject)

      },reject);
  });
};

module.exports = sendToAdminPanel;
