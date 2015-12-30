require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT || 3002;
process.env.STRIPE_SECRET_KEY      = process.env.STRIPE_SECRET_KEY||'sk_test_qNt8nbmpti7cUDTSpSwrQoQJ';
process.env.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY||'pk_test_Gs3mml7J0sPmODW6ZS8o8R3h';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mandrill_api = require('mandrill-api/mandrill');
var mandrill = new mandrill_api.Mandrill(process.env.MANDRILL_KEY);
var fs = require('fs');
var rp = require('request-promise');
var Promise = require("es6-promise").Promise;
var dumpPromise = require('./lib/debug/dumpPromise');
var Sequelize = require('sequelize');
var db = new Sequelize(process.env.CONNECTION);
var stripeAPI = require("stripe")(process.env.STRIPE_SECRET_KEY);

var subscribeToStripe = require('./lib/subscribeToStripe');
var parseStringPlan = require('./lib/parseStringPlan');
var sendToAdminPanel = require('./lib/sendToAdminPanel');
var insertToPostgre = require('./lib/insertTopostgre');
var getStripePlans = require('./lib/getStripePlans')(stripeAPI);
var sendNewRequestEmailToStaff = require('./lib/sendNewRequestEmailToStaff')(mandrill);

var renderIndexHtmlOnStartUp = require('./lib/renderIndexHtmlOnStartUp')();

renderIndexHtmlOnStartUp(getStripePlans());

app.use(bodyParser());

var server = app.listen(process.env.APP_PORT, function() {
  console.log('Listing on port: ' + process.env.APP_PORT);
});

var User = require('./lib/signUpRequestModel')(db);

app.post('/auctioneer-signup/submit', function(req, res) {

  var userRequestRaw = req.body||{};

  var stripePlansListPromise = getStripePlans();

  // console.log({userRequestRaw:userRequestRaw});
  var selectedPlanPromise = parseStringPlan(stripePlansListPromise, userRequestRaw.plan, userRequestRaw.bidders); //'plan_'
  dumpPromise('selectedPlanPromise',selectedPlanPromise);

  // create cus_ card_ sub_
  var customerPromise = subscribeToStripe(selectedPlanPromise, userRequestRaw, stripeAPI);
  dumpPromise('customerPromise',customerPromise);

  var dbPromise = insertToPostgre(customerPromise, User, userRequestRaw);
  dumpPromise('dbPromise',dbPromise);

  var adminPanelPromise = sendToAdminPanel(dbPromise, userRequestRaw.password, selectedPlanPromise);
  dumpPromise('adminPanelPromise',adminPanelPromise);

  // finishes the request's response
  sendNewRequestEmailToStaff(userRequestRaw,res);

});
