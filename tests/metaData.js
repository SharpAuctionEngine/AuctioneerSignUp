var mapMetaDataForStripe = require('./../lib/mapMetaDataForStripe');

var testMapMetaDataForStripe = function(data)
{
    console.log({metaDataInput:data});
    var metaData = mapMetaDataForStripe(data);
    console.log({metaDataInput:metaData});
    return metaData;
};

testMapMetaDataForStripe({
    name:'billy',
    password:'password',
    ankles:{
        password:'password',
        assembly:'43'
    },
});
