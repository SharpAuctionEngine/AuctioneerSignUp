/**
 *
 * Accepts From String:
 *
SEND_EMAIL_TO='[{"email":"help@sharpauctionengine.com","type":"to"},{"email":"carolyn@sharpauctionengine.com","type":"cc"}]'
SEND_EMAIL_TO='help@sharpauctionengine.com,help@sharpauctionengine.com'

 */

module.exports = function(SEND_EMAIL_TO){

    if (typeof SEND_EMAIL_TO === 'string')
    {
        if (SEND_EMAIL_TO.lastIndexOf('[', 0) === 0)
        {
            SEND_EMAIL_TO = JSON.parse(SEND_EMAIL_TO);
        }
        else
        {
            SEND_EMAIL_TO = SEND_EMAIL_TO.split(',');
        }
    }

    try{
        var SEND_EMAIL_TO = SEND_EMAIL_TO.map(function(recipient)
        {
            if (typeof recipient === 'string')
            {
                recipient = {email:recipient};
            }
            //console.log();
            recipient.type = recipient.type||'to';

            return recipient;
        });

        if (SEND_EMAIL_TO.length < 1)
        {
            throw new Error("SEND_EMAIL_TO CANNOT BE EMPTY");
        }
    }
    catch(err)
    {
        console.error({invalid:true,SEND_EMAIL_TO:process.env.SEND_EMAIL_TO,Exception:err});
        throw err;
    }

    // console.log({SEND_EMAIL_TO:SEND_EMAIL_TO});
    return SEND_EMAIL_TO;
};
