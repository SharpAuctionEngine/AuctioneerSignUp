/*

curl localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=test' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=testaaaa' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=tes' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=t' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=tsdfsdfsdfdsfdsfsdf' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=auctioneer' -v && echo ''
curl 'localhost:7001/auctioneer-signup/v1/typeahead/is/domain/available?domain=auctioneer1' -v && echo ''

*/
var Promise = require('es6-promise').Promise;
var rp = require('request-promise');
// var curlify = require('request-as-curl');
var dumpPromise = require('../debug/dumpPromise');
var minimumDomainLength = process.env.MINIMUM_INSTANCE_DOMAIN;

var init = function(cacheRedis,db){

    return function (req, res) {

        var isDomainAvailable = new Promise(function(resolve,reject)
        {
            if (req.query.domain && req.query.domain.length >= minimumDomainLength && req.query.domain.length < 100)
            {

                // @link https://git.spacegazebo.com/SharpAuctionEngine/Admin-Panel/issues/92#issuecomment-99158
                var base_uri = process.env.ADMIN_PANEL_BASE_URI;

                // @todo throttle
                var apDomainPromise = rp({
                  uri: base_uri+'/api/v1.0/houses',
                  method: 'GET',
                  json: true, // automatically parse response JSON
                  qs: {
                    q: JSON.stringify({
                      filters: [{
                        name: "main_domain", // not custom_vanity_domain
                        op:   "equals",
                        val:  req.query.domain
                      }]
                    })
                  }
                });

                // dumpPromise('apDomainPromise', apDomainPromise);

                apDomainPromise.then(function(apResponse)
                {
                    apResponse.objects = apResponse.objects.map(function(house){
                      return {
                          main_domain:          house.main_domain,
                          custom_vanity_domain: house.custom_vanity_domain,
                          email:                house.email,
                          name:                 house.name,
                      };
                    });
                    // console.log({objects:apResponse.objects.map(function(house){
                    //   return {
                    //       main_domain:          house.main_domain,
                    //       custom_vanity_domain: house.custom_vanity_domain,
                    //       email:                house.email,
                    //       name:                 house.name,
                    //   };
                    // })});
                    console.log(apResponse);
                    console.log({num_results:apResponse.num_results});
                    resolve(apResponse);
                }, reject).catch(reject);
            }
            else
            {

                return reject();
            }
        });

        isDomainAvailable.then(function(apResponse){
            res.send({
                is_available:apResponse.num_results ? false : true,
                // apResponse:apResponse,
                domain:req.query.domain,
            },200);
        },function(err){
            console.error({error:err});
            if(err.statusCode!=200)
            {
                res.send('ASU could not validate main-domain against Admin-Panel',err.statusCode);
            }
            else{
            res.send({
                is_available:false,
                domain:req.query.domain,
            },200);
          }
        });

    };
};

module.exports = init;
