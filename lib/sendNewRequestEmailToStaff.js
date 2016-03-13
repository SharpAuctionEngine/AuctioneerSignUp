var fs = require('fs');
var Hogan = require('hogan.js');
var newAuctioneerDetailsEmailTemplate = Hogan.compile(fs.readFileSync('./views/new_auctioneer_details_request.hjs', 'utf-8'));
var log4js= require('log4js');
var log = log4js.getLogger();

var sendNewRequestEmailToStaff = function(mandrill) {

    return function(userRequestRaw, res, adminPanelPromise, next) {


            var adminpanelpromiseresolve = function(apResponse) {
        
            if (apResponse.error)
               {
                     if (apResponse.statusCode===400) {
                        res.send('Duplicate_Email', 400);
                    
                        }
                     if(apResponse.statusCode===500)
                        {
                         res.send('Internal Server Error:'+apResponse.message, 500);
                        }
             log.error("Admin Panel Response Error:",apResponse.message);
              // res.send(apResponse.error,apResponse.statusCode)
              return next();
                }
                 // else
                // {
                //     res.send('House URl:'+apResponse.url,200);
                //     return next();
                // }
            if(apResponse.name==='SequelizeDatabaseError')
               {
                res.send('DB error:'+apResponse.message,500);
                log.error("Got Database Error:",apResponse.message);
                return next();
               }
                var userRequest = [];

                var htmlMessage = null;

                for (var key in userRequestRaw) {
                    if (typeof userRequestRaw[key] !== 'string') {
                        // skip non strings
                     } else if (key === 'msg') {
                        htmlMessage = userRequestRaw[key];
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

                var message = {
                    // html:"<p>New Message:<br/>"+userRequestRaw.msg+"</p><p>Phone Number: "+userRequestRaw.phoneNumber,
                    html: newAuctioneerDetailsEmailTemplate.render({
                        userRequest: userRequest,
                        message: htmlMessage,
                    }),
                    text: "New Request",
                    subject: (process.env.TO_FOH_SUBJECT_PREFIX || '') + userRequestRaw.subject,
                    from_email: userRequestRaw.email,
                    from_name: userRequestRaw.name,

                    to: [{
                        email: process.env.SAE_HELP_EMAIL,
                        name: "SAE",
                        type: "to"
                    }, {
                        email: process.env.SAE_CC_EMAIL,
                        name: "SAE",
                        type: "bcc"
                    }],
                    headers: {
                        'Reply-To': userRequestRaw.email
                    },
                    bcc_address: process.env.SAE_EMAIL
                };

                mandrill.messages.send({
                        message: message,
                        async: true
                    }, function(results) {

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
                    function(e) {
                        // Mandrill returns the error as an object with name and message keys

                        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'

                        res.send('Sorry, the email could not be sent! Please contact us at ' + process.env.SAE_HELP_EMAIL + '.', 500);

                    });
            };
        adminPanelPromise.then(adminpanelpromiseresolve,adminpanelpromiseresolve);
        return;
        


    };

};

module.exports = sendNewRequestEmailToStaff;