var dumpPromise = function(name,promise)
{
    promise.then(function(result)
    {
        console.log(name+':resolve');
        console.log(result);
    },function(result)
    {
        console.log(name+':reject');
        console.warn(result);
    }).catch(function(result)
    {
        console.log(name+':catch');
        console.error(result);
    });
};

module.exports = dumpPromise;
