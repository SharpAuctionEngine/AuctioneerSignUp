require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT || 3002;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mandrill_api = require('mandrill-api/mandrill');
var mandrill = new mandrill_api.Mandrill(process.env.MANDRILL_KEY);
// var pg = require('pg');
var fs = require('fs');
// var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/auctioneersignup';
// var client = new pg.Client(connectionString);
var Sequelize = require('sequelize');
var rp = require('request-promise');
var db = new Sequelize(process.env.CONNECTION);
// client.connect();
var Promise = require("es6-promise").Promise;
var stripeAPI = require("stripe")("sk_test_qNt8nbmpti7cUDTSpSwrQoQJ");
var subscribeToStripe = require('./lib/subscribeToStripe');
var parseStringPlan = require('./lib/parseStringPlan');
var sendToAdminPanel = require('./lib/sendToAdminPanel');
var insertToPostgre = require('./lib/insertTopostgre');
var getStripePlans = require('./lib/getStripePlans')(stripeAPI);
var dumpPromise = require('./lib/debug/dumpPromise');
var sendNewRequestEmailToStaff = require('./lib/sendNewRequestEmailToStaff')(mandrill);

// const SEND_EMAIL_TO = require('./lib/getSendEmailTo')(process.env.SEND_EMAIL_TO);
// console.log({SEND_EMAIL_TO:SEND_EMAIL_TO});

var renderIndexHtmlOnStartUp = require('./renderIndexHtmlOnStartUp')();

renderIndexHtmlOnStartUp(getStripePlans());

app.use(bodyParser());
var server = app.listen(process.env.APP_PORT, function() {
  console.log('Listing on port: ' + process.env.APP_PORT);
});

var User = require('./lib/signUpRequestModel')(db);

app.post('/auctioneer-signup/submit', function(req, res) {

  var userRequestRaw = req.body||{};

  var stripePlansPromise = getStripePlans();

  // console.log({userRequestRaw:userRequestRaw});
  var stripePlan = parseStringPlan(stripePlansPromise, userRequestRaw.plan, userRequestRaw.bidders); //'plan_'
  dumpPromise('stripePlan',stripePlan);

  // create cus_ card_ sub_
  var customerPromise = subscribeToStripe(stripePlan, userRequestRaw, stripeAPI);
  dumpPromise('customerPromise',customerPromise);

  var dbPromise = insertToPostgre(customerPromise, User, userRequestRaw);
  dumpPromise('dbPromise',dbPromise);

  var adminPanelPromise = sendToAdminPanel(dbPromise, userRequestRaw.password, stripePlan);
  dumpPromise('adminPanelPromise',adminPanelPromise);

  var sendStaffEmailPromise = sendNewRequestEmailToStaff(userRequestRaw);
  dumpPromise('sendStaffEmailPromise',sendStaffEmailPromise);

});
