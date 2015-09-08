require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT||3039;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var Hogan = require('hogan.js');
// var mandrill_api = require('mandrill-api/mandrill');
// var mandrill = new mandrill_api.Mandrill(process.env.MANDRILL_KEY);
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/auctioneersignup';
var client = new pg.Client(connectionString);
var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var db = new Sequelize('postgres://postgres:password@localhost:5432/auctioneersignup');
client.connect();




app.use(bodyParser());
var server = app.listen(process.env.APP_PORT, function() {
    console.log('Listing on port: '+process.env.APP_PORT)
});
var User = db.define('auctioneersignup', {
	 
    id: {
              type:Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
              },

          createdAt: {
                     type:Sequelize.DATE
                     },
          updatedAt: {
                     type:Sequelize.DATE
                     },

          username: {
                    type:Sequelize.STRING,
                    defaultValue: false,
                    allowNull: false
                    },
          email: {
                 type:Sequelize.STRING,
                 defaultValue: false,
                 allowNull: false
                 },
          auction_house_name:{ 
                             type:Sequelize.STRING,
                             defaultValue: false,
                             allowNull: false
                             },
          auction_house_name_url:{
                                 type:Sequelize.STRING,
                                 defaultValue: false,
                                 allowNull: false
                                 },
          jsonblob :
                    {
                      type:Sequelize.JSON,
                      defaultValue: false,
                      allowNull: false
                    }
	
});
app.post('/signup',function(req,res){

    var userRequestRaw = req.body;  
 // console.log(values); 
    req.body = userRequestRaw;


db.sync().then(function() {
  return User.create({
     username:userRequestRaw.username,
     email:userRequestRaw.email,
     auction_house_name:userRequestRaw.house_name,
     auction_house_name_url:userRequestRaw.house_url,
  	 jsonblob: userRequestRaw,
  });
})
.then(function(jane) {
  console.log(jane.get({
    plain: true
  }))
  // .then(function(User) {
  //     expect(User.jsonField).to.be.a('object');
      
    });
// });

  

    pg.connect(connectionString, function(err, client, done) {

 	// client.query("INSERT INTO register(username,email,auction_house,auction_houseurl) values($1,$2,$3,$4)",[userRequestRaw.username,userRequestRaw.email,userRequestRaw.house_name,userRequestRaw.house_url]);

   //   client.query("INSERT INTO register(data) values($1)",values[UserDetails]);

   //    var query = client.query("SELECT * FROM register ORDER BY username ASC;");

   //      // Stream results back one row at a time
   //      query.on('row', function(row) {
   //          results.push(row);
   //      });

   //      // After all data is returned, close connection and return results
   //      query.on('end', function() {
   //          client.end();
   //          return res.json(results);
   //      });
 	 // // if(err) {
   // //        console.log(err);
   // //      }
               	

       });
});