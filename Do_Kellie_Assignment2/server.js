/* Kellie Do's Assignment 2 Server.js  
Referenced Lab 13, Lab 14 and Assignment 1 & 2 examples
*/

var data = require('./public/product_data.js'); // load product data
var products_array = data.products; // put data in product_data file into the variable products_array
const queryString = require('query-string'); // use variable querystring as the loaded module
var express = require('express'); // load express module
var app = express(); // set module
var myParser = require("body-parser"); // load body parser module
var fs = require('fs'); // load file system
var filename = 'user_data.json'; // store user_data.json file in variable filename
const { response } = require('express');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // display in console the request method and path
    next(); // continue
});

// taken from lab 13, starts parser
app.use(myParser.urlencoded({ extended: true })); // use the data in the body

// taken from lab 14, checks to see if user_data.json exists
if (fs.existsSync(filename)) { // if file exists
  stats = fs.statSync(filename) // get stats from file
  console.log(filename + 'has' + stats.size + 'characters'); // output in console how many characters the file has
  data = fs.readFileSync(filename, 'utf-8'); 
  user_data = JSON.parse(data); 
} else { 
  console.log(filename + 'does not exist!'); // output in console file does not exist
}

// refrenced Lab 14 and assignment 2 examples, process the login to either the invoice or go back to the login page
app.post("/process_login", function (request, response) {
  var login_error = []; 
  console.log(request.query); // print the request
  lowercaseusername = request.body.username.toLowerCase(); // Sets username to lowercase
  if (typeof users_reg_data[lowercaseusername] != 'undefined') { // checks if username is in the system
      if (users_reg_data[lowercaseusername].password == request.body.password) { // get password
          request.query.username = lowercaseusername; // username gets added to the query object
          console.log(users_reg_data[request.query.username].name); // output users username in console
          request.query.name = users_reg_data[request.query.username].name; // get the username
          response.redirect('/invoice.html?' + queryString.stringify(request.query)); // if username and password is valid, go to invoice
      } else { 
          login_error.push = ('Invalid Password'); // display error
          console.log(login_error); // display error in console
          request.query.username = lowercaseusername; // set username to query
          request.query.name = users_reg_data[lowercaseusername].name; // set the username
          request.query.login_error = login_error.join(';'); 
      }
  } else { 
      login_error.push = ('Invalid Username'); // display error
      console.log(login_error); // display error in console
      request.query.username = lowercaseusername; // set username
      request.query.login_error = login_error.join(';');
  }
  response.redirect('./login.html?' + queryString.stringify(request.query)); // if password or username is incorrect go back to login page
});

// referenced lab 14 and assignment 2 examples
app.post("/process_registration", function (request, response) {
  var errors = [];
  console.log(request.body);
  lowercaseusername = request.body.username.toLowerCase(); // make username lowercase
  /* Full name validation */
  if (/^[A-Za-z]+$/.test(request.body.name)) { // make sure the full name consists of letters only
  } else {
      errors.push('Full name must consist of letters only');
  } 
  if (request.body.name == "") { // full name validation
      errors.push('Invalid full name');
  }
  if ((request.body.fullname.length > 30)) { // checks if fullname is 30 characters or less
      errors.push('Full name must be 30 characters or less')
  }

  /* Username validation */
  if (typeof users_reg_data[lowercaseusername] != 'undefined') { // if username is taken (already in user_data.json), notify user
      errors.push("Username is already taken");
  }
  if (/^[0-9a-zA-Z]+$/.test(request.body.lowercaseusername)) { // only allows the usage of letters and numbers when inputting username into the form
  } else {
      errors.push('Username must consist of only letters and numbers');
  }
  if ((request.body.username.length > 10)) { // alerts user if username is too long
      errors.push('Username must be 10 characters or less');
  }
  if ((request.body.username.length < 4)) { // alerts user if username is too short
      errors.push('Username must be 4 characters or more');
  }

  /* Password validation */
  if (request.body.password.length < 6) { // Notifies user if password is too short
      errors.push('Password is too short; Minimum is 6 characters')
  }
  if (request.body.password !== request.body.repeat_password) { // Notifies user if password and their repeated passwords do not match up
      errors.push('Passwords do not match');
  }

  /* Email validation */
  if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email)) { // only allows letters and numbers for the user address and letters for the domain name
  } else {
      errors.push('Please enter a valid email'); // alerts user of error
  }

  /* If there are no errors, save the user's registration to user_data.json */
  if (errors.length == 0) {
      console.log(errors)
      var username = request.body.username // get username
  /* The following will get inputted to the user_data.json */
      users_reg_data[username] = {};
      users_reg_data[username].name = request.body.name;
      users_reg_data[username].username = request.body.username
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;
      fs.writeFileSync(filename, JSON.stringify(users_reg_data)); // write new data into user_data.json as a string
      response.redirect('./invoice.html?' + queryString.stringify(request.query)); // Redirects to invoice if all is ok
  } else { 
  /* If there are errors, send the user back to the registration page */
      console.log(errors)
  /* Make login values sticky */
      request.query.name = request.body.name;
      request.query.username = request.body.username;
      request.query.password = request.body.password;
      request.query.repeat_password = request.body.repeat_password;
      request.query.email = request.body.email;
      response.redirect('/register.html?' + queryString.stringify(request.query)); // Redirect to registration page if there are errors
  }
});

// Lab 13
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

app.use(express.static('./public')); // serve files from public directory in static route
app.listen(8080, () => console.log(`listening on port 8080`)); // run server on port8080