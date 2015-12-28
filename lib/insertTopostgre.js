var Promise = require('es6-promise').Promise;
var Sequelize = require('sequelize');
var db = new Sequelize(process.env.CONNECTION);
var dumpPromise = require('./debug/dumpPromise');

var insertToPostgre = function(customerPromise, User,  userRequestRaw) {

  return new Promise(function(resolve, reject) {
    customerPromise.then(function(customer) {
      // asynchronously called
      User.sync().then(function() {
        var UserCreate = User.create({
          username:               userRequestRaw.username,
          email:                  userRequestRaw.email,
          auction_house_name:     userRequestRaw.auction_house_name,
          auction_house_name_url: userRequestRaw.auction_house_name_url,
          jsonblob:               userRequestRaw,
          stripejson:             customer,
        });
        UserCreate.then(resolve, reject);
        UserCreate.catch(reject);

        dumpPromise('UserCreate',UserCreate);

      });
    });


  });
};
module.exports = insertToPostgre;
