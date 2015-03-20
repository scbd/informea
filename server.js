require('odata-server');

console.log('Starting OData server.');

$data.createODataServer({
    type: require('./context.js'),
    checkPermission: function(access, user, entitySets, callback) {
        
        if(access & $data.Access.Read) callback.success();
        else                           callback.error('auth fail');
    }
}, '/informea.svc', 5000, 'localhost');

console.log('OData server listening on http://localhost:5000/informea.svc');

// NO EXPORTS - MAIN FILE
