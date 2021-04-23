/* Kellie Do's Assignment 2 Server.js  
Referenced Lab 13, Lab 14 and Assignment 1 examples
*/

var data = require('./public/product_data.js'); // load product data
var products_array = data.products; // put data in product_data file into the variable products_array
const queryString = require('query-string'); // use variable querystring as the loaded module
var express = require('express'); // load express module
var app = express(); // set module
var myParser = require("body-parser"); // load body parser module
var filename = 'user_data.json'; // store user_data.json file in variable filename
var fs = require('fs'); // load file system
const { response } = require('express');

if (fs.existsSync(filename)) { // if file exists
    stats = fs.statSync(filename) // get stats from file
    console.log(filename + 'has' + stats.size + 'characters'); // output in console how many characters the file has
    data = fs.readFileSync(filename, 'utf-8'); 
    user_data = JSON.parse(data); 
} else { 
    console.log(filename + 'does not exist!'); // output in console file does not exist
}

// refrenced Lab 14, process the login to either the invoice or go back to the login page
app.post("/process_login", function (request, response) {
    var login_error = []; // assume no errors at first
    // POST = request.body;
    var stringify = queryString.stringify(POST);
    form_username = request.body.username.toLowerCase(); // make the username all lowercase
    if (typeof user_data[form_username] != 'undefined') { // if username is valid
        if (user_data[form_username].password == request.body.password) { // check the password for it
          request.query.username = form_username;
          console.log(user_data[request.query.username].name);
          request.query.name = user_data[request.query.username].name
          response.redirect('/invoice.html?' + stringified)
          return;
        }
     } else {
            login_error.push = ('Invalid Username or Password');
            console.log(login_error);
            request.query.username = form_username;
            request.query.name = user_data[form_username].name;
            request.query.login_error = login_error.join(';');
        }
        response.redirect('./login_page.html?' + stringified);
});

app.post("/process_register", function (request, response) {
    let POST = request.body; // get the body
    var registration_errors = []; // assume no errors at first
    var stringified = queryString.strigify(POST);

    if ((/.{3,9}/.test(POST['username'])) && (/^[a-zA-Z0-9]*$/.test(POST['username']))) { // validate username
        console.log('username OK');
      } else {
        registration_errors.push('Username must be between 4-10 characters using only letters and numbers');
      }
      // check for duplicate usernames in user_data.json
      var register_username = POST['username'].toLowerCase(); // make the username lowercase
      if (user_data[register_username] != 'undefined') { // if registered username matches
        registration_errors.push('That username is unavailable, please create a different one');
      } else {
        console.log('New username registered');
      }
    
      // check if password is less than 6 characters
      if (POST['password'].length < 6) {
        registration_errors.push('Password is too short, password length must be a minimum of 6 characters');
      } else {
        console.log('password OK');
      }
    
      // check if both passwords match
      if (POST['password'] == POST['confirmpassword']) {
        console.log('Passwords match');
      } else {
        registration_errors.push('Please check that passwords match');
      }
    
      // validate full name
      if (/^[A-Za-z]+$/.test(POST['name']) || (POST['name'] != "undefined")) {
        console.log('full name OK');
      } else {
        registration_errors.push('Please use letters only');
      }
      // validate email
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(POST['email'])) {
        console.log('email OK');
      } else {
        registration_errors.push('Invalid email');
      }
    
      // if there are no errors, register user and add their data into user_data.json
      if (registration_errors.length == 0) { // no registration errors exist
        // add registered user data to file
        username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];
    
        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");
    
        response.redirect('./invoice.html?' + stringified); // send user to invoice
      } 
      if (registration_errors.length == 0) {
        response.send("Sorry, try again");
      }
    });


app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // display in console the request method and path
    next(); // continue
});

// taken from lab 13
app.use(myParser.urlencoded({ extended: true })); // use the data in the body

app.post("/process_purchase", function (request, response) {
    let POST = request.body; // take the data and package it in the body
    if (typeof POST['purchase_submit'] != 'undefined') { 
        var hasvalidquantities = true; // assume has valid quantities
        var hasquantities = false; // assume there are quantities
        for (i = 0; i < products.length; i++) {
            qty = POST[`quantity${i}`];
            hasquantities = hasquantities || qty > 0;
            hasvalidquantities = hasvalidquantities && isNonNegInt(qty);
        }
        var stringified = queryString.stringify(POST); // converts to json
        if (hasvalidquantities && hasquantities) { // if quantities are valid
            response.redirect("./login.html?" + stringified); // goes to login page
            return;
        } else {
            response.redirect("./products_display.html?" + stringified)
        }
    }    
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