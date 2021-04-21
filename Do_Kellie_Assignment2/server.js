/* Kellie Do's Assignment 2 Server.js  
Referenced Lab 13, Lab 14 and Assignment 1 examples
*/

var data = require('./public/product_data.js'); // load product data
var products_array = data.products; // put data in product_data file into the variable products_array
const qs = require('qs'); // use variable qs as the loaded module
var express = require('express'); // load express module
var app = express(); // set module
var myParser = require("body-parser"); // load body parser module
var filename = 'user_data.json'; // store user_data.json file in variable filename
var fs = require('fs'); // load file system

if (fs.existsSync(filename)) { // if file exists
    stats = fs.statSync(filename) // get stats from file
    console.log(filename + 'has' + stats.size + 'characters'); // output in console how many characters the file has
    data = fs.readFileSync(filename, 'utf-8'); 
    users_reg_data = JSON.parse(data); 
} else { 
    console.log(filename + 'does not exist!'); // output in console file does not exist
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // display in console the request method and path
    next(); // continue
});

// taken from lab 13
app.use(myParser.urlencoded({ extended: true })); // use the data in the body

app.post("/process_purchase", function (request, response) {
    let POST = request.body; // take the data in the body
    //if (typeof POST[])
});


// checks if inputs are negative or not integers, outputs if errors exists
function isNonNegInt(string_to_check, returnErrors = false) { 
    if (string_to_check == "") string_to_check = 0;
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) // Check if string is a number value
        errors.push('<font color="red">Not a number!</font>');
    else if (string_to_check < 0) // Check if it is non-negative
        errors.push('<font color="red">Negative value!</font>');
    else if (parseInt(string_to_check) != string_to_check) // Check that it is an integer
        errors.push('<font color="red">Not an integer!</font>'); 
    return returnErrors ? errors : (errors.length == 0); 
}

app.use(express.static('./public')); // serve files from public directory
app.listen(8080, () => console.log(`listening on port 8080`)); // run server on port8080