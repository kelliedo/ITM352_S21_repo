const { response } = require('express');
var express = require('express');
var app = express();


app.all('*', function (request, response, next) {
    response.send(request.method + ' to path ' + request.path + ' with query' + JSON.stringify(request.query));
    next();
});

function process_quantity_form (POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
       receipt = '';
       for(i in products) { 
        let q = POST[`quantity_textbox${i}`];
        let model = products[i]['model'];
        let model_price = products[i]['price'];
        if (isNonNegInt(q)) {
          receipt += `<h3>Thank you for purchasing: ${q} ${model}. Your total is \$${q * model_price}!</h3>`; // render template string
        } else {
          receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
        }
      }
      response.send(receipt);
      response.end();
    }
 }
 

app.listen(8080, function() {
    console.log(`listening on port 8080`)
} ); // note the use of an anonymous function here
