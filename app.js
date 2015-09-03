require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT||3026;

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
var db = new Sequelize('postgres://postgres:password@localhost:5432/auctioneersignup',{define: {
  // timestamps: false
}
});
client.connect();




app.use(bodyParser());
var server = app.listen(process.env.APP_PORT, function() {
    console.log('Listing on port: '+process.env.APP_PORT)
});

app.post('/signup',function(req,res){

    var userRequestRaw = req.body;
    var UserDetails=['username','email','house_name'];

    var results = [];
    
    console.log({userRequestRaw:userRequestRaw});

var values = {};
for(var i=0;i<=UserDetails.length;i++)
{
 // userRequestRaw = {
      
  //       username:req.body.username,
		// email:req.body.email,
		// house_name:req.body.house_name,
		// house_url:req.body.house_url,
		
    	values[UserDetails[i]] = req.body[UserDetails[i]];
   		 

        // phone:"le phone</td>",
        // subject:'le subject',
        // msg:'le msg',
   // };
 }  
 console.log(values); 
    req.body = userRequestRaw;
    // res.send("success!",200);



var User = db.define('registerations', {
	 email: Sequelize.STRING,
	 username: Sequelize.STRING,
	 formData: Sequelize.JSON,
    // field: 'username'
	
});

db.sync().then(function() {
  return User.create({
    username: userRequestRaw.username,
    email   : userRequestRaw.email,
    formData: userRequestRaw,
    // birthday: new Date(1980, 6, 20)
  });
}).then(function(jane) {
  console.log(jane.get({
    plain: true
  }))
});

   return;

    pg.connect(connectionString, function(err, client, done) {

 	// client.query("INSERT INTO register(username,email,auction_house,auction_houseurl) values($1,$2,$3,$4)",[userRequestRaw.username,userRequestRaw.email,userRequestRaw.house_name,userRequestRaw.house_url]);

     client.query("INSERT INTO register(data) values($1)",values[UserDetails]);

      var query = client.query("SELECT * FROM register ORDER BY username ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });
 	 // if(err) {
   //        console.log(err);
   //      }
               	

       });
});