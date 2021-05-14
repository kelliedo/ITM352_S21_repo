/* Kellie Do's Assignment 2 Server.js  
Referenced Lab 13, Lab 14 and Assignment 1 & 2 examples
Validation copied from W3 Schools
*/

var express = require('express'); // load express module
var app = express(); // starts express
var myParser = require("body-parser"); // load parser module
var products = require("./public/product_data.js"); // get product_data.js
var queryString = require('query-string'); // use variable querystring as the loaded module
fs = require('fs'); //Use the file system module 
var filename = 'user_data.json';

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // display in console the request method and path
    next(); // continue
});

// taken from lab 13, starts parser
app.use(myParser.urlencoded({ extended: true })); 

// taken from lab 14, checks to see if user_data.json exists
if (fs.existsSync(filename)) { // if file exists
  data = fs.readFileSync(filename, 'utf-8'); // read file
  users_reg_data = JSON.parse(data); // set it to variable users_reg_data
} else { 
  console.log(filename + 'does not exist!'); // output in console file does not exist
}

// refrenced Lab 14 and assignment 2 examples, process the login to either the invoice or go back to the login page
app.post("/process_login", function (request, response) {
  var login_error = []; // create an arry of login errors
  console.log(request.query); // print the request in console
  lowercaseusername = request.body.username.toLowerCase(); // make username lowercase
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
// function that will valid all registration data
// when registration data is valid, will proceed to invoice.html
app.post("/process_register", function (req, res) { 
    qStr = req.body
    console.log(qStr);
    var errors = [];
  
    if (/^[A-Za-z]+$/.test(req.body.name)) { // validates if name consists of letters only
    }
    else { 
      errors.push('Full name must consist of letters only') // print error
    }
  
    if (req.body.name == "") { // name must include a space to ensure it is a full name
      errors.push('Invalid Full Name'); // print error
    }
  
    if ((req.body.fullname.length > 25 && req.body.fullname.length < 0)) { // checks to see if full name is less than 25 characters
      errors.push('Full Name Too Long') // print error
    }
  
    var reguser = req.body.username.toLowerCase();  // makes username lowercase
    if (typeof users_reg_data[reguser] != 'undefined') { // checks if data matches data in our user_data.json file
      errors.push('Username is already being used') // print error
    }
  
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { // checks if username consists of only letters and numbers
    }
    else {
      errors.push('Letters And Numbers Only for Username') // else, print error
    }
  
  
    if (req.body.password.length < 6) { // checks if password is 6 characters or more
      errors.push('Password Too Short') // if it's not, print error
    }
  
    if (req.body.password !== req.body.confirmpassword) { // checks if both passwords match
      errors.push('Password Not a Match') // print error if they do not match
    }
  
    if (errors.length == 0) { // if there are no errors, save data to user_data.json and go to invoice page
      POST = req.body
      console.log('no errors')
      var username = POST['username'];
      var name = POST['fullname'];
      users_reg_data[username] = {};
      users_reg_data[username].name = username;
      users_reg_data[username].password = POST['password'];
      users_reg_data[username].email = POST['email'];
      data = JSON.stringify(users_reg_data);
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./invoice.html?' + queryString.stringify(req.query)); // go to invoice.html
    }
  
    if (errors.length > 0) { // if there are errors, go back to registration page, but keep data sticky
      console.log(errors)
      req.query.name = req.body.name;
      req.query.username = req.body.username;
      req.query.password = req.body.password;
      req.query.confirmpassword = req.body.confirmpassword;
      req.query.email = req.body.email;
  
      req.query.errors = errors.join(';');
      res.redirect('register.html?' + queryString.stringify(req.query));
    }
  });

app.post("/process_purchase", function (request, response) {
  let POST = request.body; // take the data and package it in the body
  if (typeof POST['submitPurchase'] != 'undefined') { 
      var hasvalidquantities = true; // assume has valid quantities
      var hasquantities = false; // assume there are quantities
      for (i = 0; i < products.length; i++) {
          qty = POST[`quantity${i}`];
          hasquantities = hasquantities || qty > 0;
          hasvalidquantities = hasvalidquantities && isNonNegInt(qty);
      }
      const stringified = queryString.stringify(POST); // converts to json
      if (hasvalidquantities && hasquantities) { // if quantities are valid
          response.redirect("./login.html?" + stringified); // goes to login page
          return;
      } else {
          response.redirect("./products_display.html?") // go to products_display.html if quantities are not valid
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