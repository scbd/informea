var express = require('express');
var app = express();

// SET ROUTES

app.use('/informea', require('./controller'));

// START SERVER

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});

// NO EXPORTS - MAIN FILE
