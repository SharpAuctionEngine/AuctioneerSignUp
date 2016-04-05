var array_dot = require('./array_dot');

/**
 * - Stripe is strictly key:value
 * - nested metadata arrays are not allowed
 * - also removing password
 */

var mapMetaDataForStripe = function (data) {
    var metaData = array_dot(data);
    // console.log({metaDataInput:metaData});
    for (var k in metaData) {
        if (k.match(/\bpassword$/)) {
            delete metaData[k];
        }
    }
    // console.log({metaDataInput:metaData});
    return metaData;
};



module.exports = mapMetaDataForStripe;