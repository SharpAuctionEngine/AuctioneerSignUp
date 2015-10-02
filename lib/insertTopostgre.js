var Promise = require('es6-promise').Promise;
var Sequelize = require('sequelize');
var db = new Sequelize(process.env.CONNECTION);

var insertToPostgre = function (customerPromise, User, username, email, house_name, house_url, userRequestRaw) {

  return new Promise(function (resolve, reject) {
    customerPromise.then(function (customer) {
      // asynchronously called
      db.sync().then(function () {
        var UserCreate = User.create({
          username: username,
          email: email,
          auction_house_name: house_name,
          auction_house_name_url: house_url,
          jsonblob: userRequestRaw,
          stripejson: customer,
        });
        UserCreate.then(resolve,reject);
        UserCreate.catch(reject);
        UserCreate.then(function (jane) {
          console.log(jane.get({
            plain: true
          }));
        });
      })
    });


  });
}
module.exports = insertToPostgre;
