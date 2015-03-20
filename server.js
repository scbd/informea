require('odata-server');

console.log('Starting OData server.');

$data.createODataServer({
    type: require('./context.js'),
}, '/informea.svc', 5000, 'localhost');

console.log('OData server listening on http://localhost:5000/informea.svc');

// NO EXPORTS - MAIN FILE
