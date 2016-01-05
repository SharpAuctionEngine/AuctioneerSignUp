require('dotenv').load();

process.env.APP_PORT = process.env.APP_PORT || 3020;

var Promise = require("es6-promise").Promise;
var express = require('express');
var app = express();

var rp = require('request-promise');
var rollbar = require("rollbar");
rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN);
rollbar.reportMessage("Hello world!");

var rollbarMiddleware = rollbar.errorHandler({environment: app.settings.env});
// var rollbarMiddleware = rollbar.errorHandler({environment: app.settings.env});

var server = app.listen(process.env.APP_PORT, function() {
  console.log('Listing on port: ' + process.env.APP_PORT);

  //request, but with promises
  setTimeout(function(){
      rp('http://localhost:'+process.env.APP_PORT+'/rollbar/test');
  },250);
});

app.get('/rollbar/test',
    function(req,res,next)
    {
        console.log('http request received!');
        next();
    },
    function(req,res)
    {
        throw new Error('rollbar test');
    }
);

// @link http://expressjs.com/en/guide/error-handling.html
// You define error-handling middleware last, after other app.use() and routes calls
app.use(rollbarMiddleware);
