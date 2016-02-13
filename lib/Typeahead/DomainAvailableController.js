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
            if (req.query.domain && req.query.domain.length >= minimumDomainLength && req.query.domain.length < 100 && req.query.email)
            {
                // @link https://git.spacegazebo.com/SharpAuctionEngine/Admin-Panel/issues/92#issuecomment-99158
                var base_uri = process.env.ADMIN_PANEL_BASE_URI;

                // @todo throttle
                var apDomainOrEmailPromise = rp({
                  uri: base_uri+'/api/v1.0/houses',
                  method: 'GET',
                  json: true, // automatically parse response JSON
                  qs: {
                    q: JSON.stringify({
                      filters : [{ "or":[
                      {
                        "name": "main_domain", // not custom_vanity_domain
                        "op"  : "equals",
                        "val" :  req.query.domain 
                      },
                      {
                        "name": "email", 
                        "op"  : "equals",
                        "val" : req.query.email 
                      }]
                    }]
                    })
                  }
                });

                  // Query for lavenshtein match
               // var apLavenshteinDomainPromise = rp({
               //        uri: base_uri+'/api/v1.0/houses',
               //        method: 'GET',
               //        json: true, // automatically parse response JSON
               //        qs: {
               //          q: JSON.stringify({
               //            filters: [{
               //             "name": "main_domain", 
               //             "op"  : "like",
               //             "val" : "%"+req.query.domain.replace(/(\.)/,'%')+"%" 
               //            }]
               //          })
               //        }
               //      });
                // dumpPromise('apDomainPromise', apDomainPromise);
                var apResponses = function(apResponse)
                {
                    
                     var email_num_result=0;
                     var domain_num_result=0;
                     // var levenshtein_num_result=0;
                     // var lavenshteinResult=apResponse[1];
                     // var domainOremailResult=apResponse[0];
                     
                     
                    apResponse.objects =  (apResponse.objects||[]).map(function(house){
                        
                       return {
                          main_domain:          house.main_domain,
                          custom_vanity_domain: house.custom_vanity_domain,
                          email:                house.email,
                          name:                 house.name,
                      };
                       
                   });
                   // lavenshteinResultobjects = lavenshteinResult.objects.map(function(house){
                        
                   //     return {
                   //        main_domain:          house.main_domain,
                   //        custom_vanity_domain: house.custom_vanity_domain,
                   //        email:                house.email,
                   //        name:                 house.name,
                   //    };
                       
                   // });


                    if( apResponse.num_results===1)
                        {
                           if( apResponse.objects[0].email.toLowerCase() === req.query.email.toLowerCase())
                                 {
                                    email_num_result=1;
                                 }
                            if( apResponse.objects[0].main_domain===req.query.domain)
                                 {
                                 domain_num_result=1;
                                 }
                        }
                    // else
                    //    {
                    //       if(lavenshteinResult.num_results!=0)
                    //         {
                    //           levenshtein_num_result=domain_num_result?'':1; // it will be one only if there is not exact match 
                    //           console.log({lavenshteinResult_num_results:lavenshteinResult.num_results});
                    //            console.log(lavenshteinResultobjects);
                             //    }
                             // else
                             // {
                             //  console.log({lavenshteinResult_num_results:lavenshteinResult.num_results});
                             // }
                     

                        //}
                        
            
                     console.log({email:email_num_result});
                     console.log({domain:domain_num_result});
                     console.log({ apResponse_num_results: apResponse.num_results});
                     console.log( apResponse.objects);
                    // console.log({objects:apResponse.objects.map(function(house){
                    //   return {
                    //       main_domain:          house.main_domain,
                    //       custom_vanity_domain: house.custom_vanity_domain,
                    //       email:                house.email,
                    //       name:                 house.name,
                    //   };
                    // })});
                    

                    
                    resolve({domain_num_result:domain_num_result,email_num_result:email_num_result});
                    // resolve(apResponse);

                };
                // Promise.all([apDomainOrEmailPromise,apLavenshteinDomainPromise]).then(apResponses,apResponses);
              apDomainOrEmailPromise.then(apResponses,apResponses);
              
            }
            else
            {

                return reject();
            }
        });

        isDomainAvailable.then(function(apResponse){
            res.send({
                is_available:{
                    domain:apResponse.domain_num_result ? false : true,
                    email:apResponse.email_num_result ? false : true,
                   
                },
                domain:req.query.domain,
                // email:req.query.email,
               
                
            },200);
        },function(err){
            console.error({error:err});
            if(err.statusCode!=200)
            {
                res.send('ASU could not validate main-domain against Admin-Panel',err.statusCode);
            }
            else{
            res.send({
                is_available:{
                    domain:false,
                    email: false,
                   
                },
                domain:req.query.domain,
                // email:req.query.email,
                 
                
            },200);
          }
        });

    };
};

module.exports = init;
