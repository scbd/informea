require('odata-server');
require('./custom/customCompiler');
require('./custom/customConverter');
require('./custom/customFunctionCompiler');
require('./custom/customProvider');

console.log('Starting OData server.');

$data.createODataServer({
    type: require('./context.js'),
    provider: { name: 'Custom' },
    checkPermission: function(access, user, entitySets, callback) {
        
        if(access & $data.Access.Read) callback.success();
        else                           callback.error('auth fail');
    }
}, '/informea.svc', 8000);

console.log('OData server listening on http://0.0.0.0:8000/informea.svc');

// NO EXPORTS - MAIN FILE
