require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT||3002;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Hogan = require('hogan.js');
var mandrill_api = require('mandrill-api/mandrill');
var mandrill = new mandrill_api.Mandrill(process.env.MANDRILL_KEY);
// var pg = require('pg');
var fs = require('fs');
// var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/auctioneersignup';
// var client = new pg.Client(connectionString);
var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var db = new Sequelize(process.env.CONNECTION);
// client.connect();
var newAuctioneerDetailsEmailTemplate = Hogan.compile(fs.readFileSync('./views/new_auctioneer_details_request.hjs', 'utf-8'));



app.use(bodyParser());
var server = app.listen(process.env.APP_PORT, function() {
    console.log('Listing on port: '+process.env.APP_PORT)
});
var User = db.define('auctioneersignup', {
	 
    id: 	  {
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
                    // allowNull: false
                    },
          email: {
                 type:Sequelize.STRING,
                 defaultValue: false,
                 // allowNull: false
                 },
          auction_house_name:{ 
                             type:Sequelize.STRING,
                             defaultValue: false,
                             // allowNull: false
                             },
          auction_house_name_url:{
                                 type:Sequelize.STRING,
                                 defaultValue: false,
                                 // allowNull: false
                                 },
          jsonblob :
                    {
                      type:Sequelize.JSON,
                      defaultValue: false,
                      allowNull: false
                    },
	     results :
                    {
                      type:Sequelize.JSON,
                      defaultValue: false,
                      allowNull: false
                    }
});
app.post('/signup',function(req,res)
	{

    var userRequestRaw = req.body;  
 // console.log(values); 
    req.body = userRequestRaw;


	db.sync().then(function() 
		{
  		return User.create(
  			{
		    username:userRequestRaw.username,
		    email:userRequestRaw.email,
		    auction_house_name:userRequestRaw.house_name,
		    auction_house_name_url:userRequestRaw.house_url,
		  	jsonblob: userRequestRaw,
  			});
		})
		.then(function(jane) 
		    {
  		    console.log(jane.get(
  		    	{
  				plain: true
  				}))
  			
			});
   	var userRequest = [];

    var message = null;

    for (var key in userRequestRaw)
    	{
        	if (typeof userRequestRaw[key]!=='string')
        		{
            // skip non strings
        		}
        	else if (key==='msg')
       			{
            	message = userRequestRaw[key];
        		}
        	else if({subject:1}[key])
        		{
            //skip these keys
        		}
        	else
        		{
            	userRequest.push(
            		{
                	key:key,
                	value:userRequestRaw[key],
            		});
       		    }
    	}


    var message = 
    	{
        // html:"<p>New Message:<br/>"+req.body.msg+"</p><p>Phone Number: "+req.body.phoneNumber,
        html:newAuctioneerDetailsEmailTemplate.render(
        	{
            	userRequest:userRequest,
            	message:message,
        	}),
        text: "New Request",
        subject: (process.env.TO_FOH_SUBJECT_PREFIX||'')+req.body.subject,
        from_email: req.body.email,
        from_name: req.body.name,

        to: [{
                email:process.env.SAE_HELP_EMAIL,
                name: "SAE",
                type: "to"
        	 },

        	{
                email:process.env.SAE_CC_EMAIL,
                name: "SAE",
                type: "bcc"
            }
            ],
        headers: {
            'Reply-To': req.body.email
                 },
         bcc_address:process.env.SAE_EMAIL
        }
// console.log(message);
    //var return_path_domain = null;
    /**
     * 
     * async = true // this is so that we can give the user a response faster
     */

    mandrill.messages.send({message:message, async: true}, function(results,b)
    	{
      
        	if (results.length === 2 )
        		{
            		var result = results[0];
            		 
            
          		    if (result.reject_reason)
            			{
                			res.send('Sorry, the email could not be sent! Please contact us at '+process.env.SAE_HELP_EMAIL+'.',400);
            			}
            		else
           				{
			                res.send('Email Sent!',200);
			                
        			    }
        		}
        	else
        		{
            		res.send('Results Not Equal To One',500);
        		}
        	console.log({results:results});
        /**
         * @link https://mandrillapp.com/api/docs/messages.php.html
         * 
         * note that the results assume that more than one email could
         * have been sent out
        [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123"
        }]
        */
    	}, 
    function(e) 
    	{
        	// Mandrill returns the error as an object with name and message keys
       
        	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        
       		res.send('Sorry, the email could not be sent! Please contact us at '+process.env.SAE_HELP_EMAIL+'.',500);

  		});

  //   pg.connect(connectionString, function(err, client, done) {

 	// // client.query("INSERT INTO register(username,email,auction_house,auction_houseurl) values($1,$2,$3,$4)",[userRequestRaw.username,userRequestRaw.email,userRequestRaw.house_name,userRequestRaw.house_url]);

  //  //   client.query("INSERT INTO register(data) values($1)",values[UserDetails]);

  //  //    var query = client.query("SELECT * FROM register ORDER BY username ASC;");

  //  //      // Stream results back one row at a time
  //  //      query.on('row', function(row) {
  //  //          results.push(row);
  //  //      });

  //  //      // After all data is returned, close connection and return results
  //  //      query.on('end', function() {
  //  //          client.end();
  //  //          return res.json(results);
  //  //      });
 	//  // // if(err) {
  //  // //        console.log(err);
  //  // //      }
               	

       // });
    });