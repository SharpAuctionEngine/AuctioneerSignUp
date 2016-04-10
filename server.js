require('dotenv').load();
var rollbar = require('./lib/debug/rollbar');

process.env.APP_PORT = process.env.APP_PORT || 3002;
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_qNt8nbmpti7cUDTSpSwrQoQJ';
process.env.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_Gs3mml7J0sPmODW6ZS8o8R3h';
process.env.ADMIN_PANEL_BASE_URI = process.env.ADMIN_PANEL_BASE_URI || 'https://kt:python@saeadmin.sae.bid';
process.env.MINIMUM_INSTANCE_DOMAIN = parseInt(process.env.MINIMUM_INSTANCE_DOMAIN) || 2;
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
var Redis = require('ioredis');

var log4js = require('log4js');
log4js.configure('./config/logConfig.json', {
    reloadSecs: 300
});
var renderIndexHtmlOnStartUp = require('./lib/renderIndexHtmlOnStartUp')();

renderIndexHtmlOnStartUp(getStripePlans());

var redis = new Redis({
    port: process.env.REDIS_PORT || 6379, // Redis port
    host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
    //family:   process.env.REDIS_FAMILY||4,           // 4 (IPv4) or 6 (IPv6)
    //password: process.env.REDIS_PASSWORD||null,
    keyPrefix: (process.env.REDIS_PREFIX || 'asu-cp') + ':',
});
// rollbar.errorHandler("ACCESS_TOKEN", {environment: 'playground'})
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log, {
    level: 'auto'
}));

app.use(bodyParser());

var server = app.listen(process.env.APP_PORT, function() {
    console.log('Listing on port: ' + process.env.APP_PORT);
});

var User = require('./lib/signUpRequestModel')(db);

var validateSignupRequest = require('./lib/validateSignupRequest')(db);

app.post('/auctioneer-signup/v1/submit', validateSignupRequest, function(req, res) {

    var userRequestRaw = req.body || {};

    var stripePlansListPromise = getStripePlans();

    // console.log({userRequestRaw:userRequestRaw});
    var selectedPlanPromise = parseStringPlan(stripePlansListPromise, userRequestRaw.stripe_plan); //'plan_'
    dumpPromise('selectedPlanPromise', selectedPlanPromise);

    // create cus_ card_ sub_
    var customerPromise = subscribeToStripe(selectedPlanPromise, userRequestRaw, stripeAPI, redis);
    dumpPromise('customerPromise', customerPromise);


    var dbPromise = insertToPostgre(customerPromise, User, userRequestRaw);
    dumpPromise('dbPromise', dbPromise);

    var adminPanelPromise = sendToAdminPanel(dbPromise, userRequestRaw.password, selectedPlanPromise);
    dumpPromise('adminPanelPromise', adminPanelPromise);


    // finishes the request's response
    sendNewRequestEmailToStaff(userRequestRaw, res, req, adminPanelPromise);

});

app.get('/auctioneer-signup/v1/typeahead/is/domain/available',
    require('./lib/Typeahead/DomainAvailableController')(redis, db)
);

// @link http://expressjs.com/en/guide/error-handling.html
// You define error-handling middleware last, after other app.use() and routes calls
app.use(rollbar.errorHandler(process.env.ROLLBAR_ACCESS_TOKEN || "e2d340481e044946ac1391204cfb09c2", {
    environment: process.env.ROLLBAR_ENV
}));