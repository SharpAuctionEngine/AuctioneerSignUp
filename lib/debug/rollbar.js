// include and initialize the rollbar library with your access token
var rollbar = require("rollbar");
rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN||"e2d340481e044946ac1391204cfb09c2");

// record a generic message and send to rollbar
// rollbar.reportMessage("Hello world!");

rollbar.handleUncaughtExceptions();

module.exports = rollbar;
