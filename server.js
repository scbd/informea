process.on('SIGABRT', function() { console.log('Received SIGABRT. Exiting...'); process.exit(); });
process.on('SIGINT',  function() { console.log('Received SIGINT. Exiting...');  process.exit(); });
process.on('SIGTERM', function() { console.log('Received SIGTERM. Exiting...'); process.exit(); });

require('odata-server');
require('./custom/customCompiler');
require('./custom/customConverter');
require('./custom/customFunctionCompiler');
require('./custom/customProvider');

console.log('Starting OData server.');

var util    = require('util');
var express = require('express');
var app     = express();

app.use('/informea.svc', $data.ODataServer({
    type: require('./context.js'),
    provider: { name: 'Custom' },
    checkPermission: function(access, user, entitySets, callback) {

        if(access & $data.Access.Read) callback.success();
        else                           callback.error('auth fail');
    }
}));

app.listen(8000);

//========================================================
//=================== ERROR HANDLING =====================
//========================================================

app.use((err, req, res, next) => {

    if(err.status     && typeof(err.status    )=='number') return res.status(err.status    ).send( { 'statusCode': err.status });
    if(err.statusCode && typeof(err.statusCode)=='number') return res.status(err.statusCode).send( { 'statusCode': err.statusCode });

    console.error(`Unhandled exception occurred on HTTP request ${req.method} ${req.url}`);
    console.error(err);

    res.status(500).send( { 'statusCode': 500 });
    //next(); // prevent errors (which may include stacktrace) from bubbling up
});

process.on('unhandledRejection', (error/*, p*/) => {
    console.error(`UNHANDLED REJECTION - ${util.format(error.stack||error)}`);
    process.exit(-1);
});

process.on('uncaughtException', (error/*, p*/) => {
    console.error(`UNCAUGHT EXCEPTION - ${util.format(error.stack||error)}`);
    process.exit(-2);
});

// NO EXPORTS - MAIN FILE

console.log('X OData server listening on http://0.0.0.0:8000/informea.svc');
