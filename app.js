require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT || 3002;

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
var rp = require('request-promise');
var db = new Sequelize(process.env.CONNECTION);
// client.connect();
var newAuctioneerDetailsEmailTemplate = Hogan.compile(fs.readFileSync('./views/new_auctioneer_details_request.hjs', 'utf-8'));
var Promise = require("es6-promise").Promise;
var stripeAPI = require("stripe")("sk_test_qNt8nbmpti7cUDTSpSwrQoQJ");
var subscribeToStripe = require('./lib/subscribeToStripe');
var parseStringPlan = require('./lib/parseStringPlan');
var sendToAdminPanel = require('./lib/sendToAdminPanel');
var insertToPostgre = require('./lib/insertTopostgre');

const SEND_EMAIL_TO = require('./lib/getSendEmailTo')(process.env.SEND_EMAIL_TO);
console.log({SEND_EMAIL_TO:SEND_EMAIL_TO});

var stripePlansPromise = stripeAPI.plans.list({
  limit: 21
});
app.use(bodyParser());
var server = app.listen(process.env.APP_PORT, function () {
  console.log('Listing on port: ' + process.env.APP_PORT);
});
var User = db.define('auctioneersignup', {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },

  username: {
    type: Sequelize.STRING,
    defaultValue: false,
    // allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    defaultValue: false,
    // allowNull: false
  },
  auction_house_name: {
    type: Sequelize.STRING,
    defaultValue: false,
    // allowNull: false
  },
  auction_house_name_url: {
    type: Sequelize.STRING,
    defaultValue: false,
    // allowNull: false
  },
  jsonblob: {
    type: Sequelize.JSON,
    defaultValue: false,
    allowNull: false
  },
  results: {
    type: Sequelize.JSON,
    defaultValue: false,
    allowNull: false
  },
  stripejson: {
    type: Sequelize.JSON,
    defaultValue: false,
    allowNull: false
  }
});

/*function insertToPostgre(customerPromise, username, email, house_name, house_url, userRequestRaw) {

  return new Promise(function (resolve, reject) {
    customerPromise.then(function (customer) {
      // asynchronously called
      var dbPromise = db.sync().then(function () {
        var UserCreate = User.create({
          username: username,
          email: email,
          auction_house_name: house_name,
          auction_house_name_url: house_url,
          jsonblob: userRequestRaw,
          stripejson: customer,
        });
        //   UserCreate.then(function(jane) {
        //   console.log(jane.get({
        //     plain: true
        //   }));
        // });
      })
    });


  });
}*/
app.post('/auctioneer-signup/submit', function (req, res) {


  var userRequestRaw = req.body;
   // console.log({userRequestRaw:userRequestRaw});
  var stripePlan = parseStringPlan(stripePlansPromise, userRequestRaw.plan, userRequestRaw.bidders); //'plan_'

  stripePlan
    .then(function (result) {
      console.log({
        parseStringPlanResolve: result
      });
    })
    .catch(function (result) {
      console.err({
        parseStringPlanReject: result
      });
    });
    // create cus_ card_ sub_
  var customerPromise = subscribeToStripe(stripePlan, userRequestRaw.stripeToken, userRequestRaw.email, stripeAPI);
  customerPromise
    .then(function (result) {
      console.log({
        subscribeToStripeResolve: result
      });
    })
    .catch(function (result) {
      console.err({
        subscribeToStripeReject: result
      });
    });

  var dbPromise = insertToPostgre(customerPromise, User, userRequestRaw.username, userRequestRaw.email, userRequestRaw.auction_house_name, userRequestRaw.auction_house_name_url, userRequestRaw);
  dbPromise
    .then(function (result) {
      console.log({
        insertToPostgreResolve: result
      });
    })
    .catch(function (result) {
      console.err({
        insertToPostgreReject: result
      });
    });

  var adminPanelPromise = sendToAdminPanel(dbPromise,userRequestRaw.password, stripePlan);

  adminPanelPromise
    .then(function (result) {
     
      console.log({
        sendToAdminPanelResolve: result
      });
      
    })
    .catch(function (result) {
      console.err({
        sendToAdminPanelReject: result,
        messages:result.error.message
      });
  
    });



  var userRequest = [];

  var message = null;

  for (var key in userRequestRaw) {
    if (typeof userRequestRaw[key] !== 'string') {
      // skip non strings
    } else if (key === 'msg') {
      message = userRequestRaw[key];
    } else if ({
        subject: 1
      }[key]) {
      //skip these keys
    } else {
      userRequest.push({
        key: key,
        value: userRequestRaw[key],
      });
    }
  }


  message = {
    // html:"<p>New Message:<br/>"+req.body.msg+"</p><p>Phone Number: "+req.body.phoneNumber,
    html: newAuctioneerDetailsEmailTemplate.render({
      userRequest: userRequest,
      message: message,
    }),
    text: "New Request",
    subject: (process.env.TO_FOH_SUBJECT_PREFIX || '') + req.body.subject,
    from_email: req.body.email,
    from_name: req.body.name,

    to: [{
        email: process.env.SAE_HELP_EMAIL,
        name: "SAE",
        type: "to"
      },

      {
        email: process.env.SAE_CC_EMAIL,
        name: "SAE",
        type: "bcc"
      }
    ],
    headers: {
      'Reply-To': req.body.email
    },
    bcc_address: process.env.SAE_EMAIL
  };

  // console.log(message);
  //var return_path_domain = null;
  /**
   * 
   * async = true // this is so that we can give the user a response faster
   */


  mandrill.messages.send({
      message: message,
      async: true
    }, function (results) {

      if (results.length === 2) {
        var result = results[0];


        if (result.reject_reason) {
          res.send('Sorry, the email could not be sent! Please contact us at ' + process.env.SAE_HELP_EMAIL + '.', 400);
        } else {
          res.send('Email Sent!', 200);

        }
      } else {
        res.send('Results Not Equal To One', 500);
      }
      // console.log({results:results});
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
    function (e) {
      // Mandrill returns the error as an object with name and message keys

      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'

      res.send('Sorry, the email could not be sent! Please contact us at ' + process.env.SAE_HELP_EMAIL + '.', 500);

    });

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

// })
