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
        if (!data.main_domain)
        {
            throw new Error('main_domain required');
        }
        if (!data.first_domain_level)
        {
            throw new Error('first_domain_level required');
        }
        if (!data.email)
        {
            throw new Error('email required');
        }
        if (!data.username)
        {
            throw new Error('username required');
        }
        if (!data.password)
        {
            throw new Error('password required');
        }

        return next();
    };
};

module.exports = validateSignupRequest;
