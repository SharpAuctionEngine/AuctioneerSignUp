var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
var slug = require('slug');
var minimumDomainLength = process.env.MINIMUM_INSTANCE_DOMAIN;

var validateSignupRequest = function(db)
{
    return function(req,res,next)
    {
        var data = req.body||{};

        // @todo pick validation library
        // @link https://github.com/poppinss/indicative/issues/44
        // minimumDomainLength default 2

        return next();
    };
};

module.exports = validateSignupRequest;
