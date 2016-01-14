var Sequelize = require('sequelize');
var JsonField = require('sequelize-json');
// 'use strict';
// const fff = 'a';
var indicative = require('indicative');

var slug = require('slug');
var minimumDomainLength = process.env.MINIMUM_INSTANCE_DOMAIN; //default already set in another file

var validateSignupRequest = function(db)
{
    return function(req,res,next)
    {
        var userdata = req.body||{};

        // @todo pick validation library
        // @link https://github.com/poppinss/indicative/issues/44
        // minimumDomainLength default 2
        // on failure, respond in laravel messagebag format:
            // res.send({
            //     errors:{
            //         main_domain:['main domain must 2 characters or longer'],
            //         email:['already taken'],
            //     }
            // },400);
        
    const rules = {
    'username'              : 'required|alpha_numeric|not_in:AuctionEngine',
    'email'                 : 'required|email',
    'password'              : 'required|min:6|max:30',
    'repeat_password'       : 'required|min:6|max:30|same:password',
    'main_domain'           : 'required',
    'first_domain_level'    : 'required',
    'first_name'            : 'required',
    'last_name'             : 'required',
    'phone_number'          : 'required|min:10|max:11',
    'zip'                   : 'required|min:5|max:5',
    'address'               : 'required',
    'city'                  : 'required',
    'states'                : 'required',



    };

    const data = {
    
   'username'               : userdata.username,
   'email'                  : userdata.email,
   'password'               : userdata.password,
   'repeat_password'        : userdata.repeat_password,
   'main_domain'            : userdata.main_domain,
   'first_domain_level'     : userdata.first_domain_level,
   'first_name'             : userdata.first_name,
   'last_name'              : userdata.last_name,
   'phone_number'           : userdata.phone_number,
   'zip'                    : userdata.zip,
   'address'                : userdata.address,
   'city'                   : userdata.city,
   'states'                 : userdata.states,
    
    };

    const messages = {
     'username.required'            : 'Username field is required.',
     'username.not_in'              : 'Username not possible',
     'email.required'               : 'Email field is required.',
     'password.required'            : 'Password field is required.',
     'repeat_password.required'     : 'Repeat Password field is required.',
     'repeat_password.same'         : 'Password doesnt match',
     'main_domain.required'         : 'Auction house name field is required.',
     'first_domain_level.required'  : 'Auction house url field is required.',
     'first_name.required'          : 'First name field is required.',
     'last_name.required'           : 'Last Name field is required.',
     'phone_number.required'        : 'Phone Number field is required.',
     'phone_number.max'             : 'Invalid Phone Number.',
     'phone_number.min'             : 'Invalid Phone Number.',
     'zip.required'                 : 'Zip Codefield is required.',
     'zip.max'                      : 'Invalid Zip Code.',
     'zip.min'                      : 'Invlid Zip Code.',
     'address.required'             : 'Address field is required.',
     'city.required'                : 'City field is required.',
     'states.required'              : 'State field is required.',

    };
    indicative
    .validateAll(data,rules,messages)
    .then(function () {
      // validation passed   
      return next();
    })
    .catch(function (errors) {
      // validation failed
      console.log(errors);
      res.send({errors:errors},400);
    })
    return
        // if (!userdata.main_domain)
        // {
        //     throw new Error('main_domain required');
        // }
        // if (!userdata.first_domain_level)
        // {
        //     throw new Error('first_domain_level required');
        // }
        // if (!userdata.email)
        // {
        //     throw new Error('email required');
        // }
        // if (!userdata.username)
        // {
        //     throw new Error('username required');
        // }
        // if (!userdata.password)
        // {
        //     throw new Error('password required');
        // }

        // return next();
    };
};

module.exports = validateSignupRequest;
