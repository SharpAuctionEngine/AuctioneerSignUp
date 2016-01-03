var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var slug = require('slug');

var validateSignupRequest = function(db)
{
    return function(req,res,next)
    {
        var data = req.body||{};
        return next();
    };
};

module.exports = validateSignupRequest;
