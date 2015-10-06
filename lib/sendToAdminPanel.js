var Promise = require('es6-promise').Promise;
var rp = require('request-promise');
// var curlify = require('request-as-curl');

var sendToAdminPanel = function (dbPromise,password,plan_key) {
  console.log('sendToAdminPanel();');
  return new Promise(function (resolve, reject) {
    dbPromise.then(function (dbData) {

        // rp('http://45.79.216.73/api/v1.0/houses/add')
        //    .then(console.dir)
        //    .catch(console.error);
        // dbData.password =password;
        // dbData.plan_key = 0;
        // console.log(JSON.stringify(dbData.password));
        // console.log(JSON.stringify(dbData.plan_key));
        // console.log(JSON.stringify(dbData));
        // console.log(JSON.stringify(dbData));

        var options = {
          uri: 'http://kt:python@45.79.216.73/api/v1.0/houses/add',
          method: 'POST',
          json: true,
          body: dbData
        };

        rp(options)
          // .then(console.dir,console.dir)
          .then(function(data){
            console.dir({requestData:data});
          },function(err){
            console.dir({requestErr:err.error.message});
          })
          .then(resolve,reject)

      },reject);
  });
};

module.exports = sendToAdminPanel;
