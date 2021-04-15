const { response } = require('express');
var express = require('express');
var app = express();


app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path + ' with query' + JSON.stringify(request.query));
    next();
});



app.listen(8080, function() {
    console.log(`listening on port 8080`)
} ); // note the use of an anonymous function here
