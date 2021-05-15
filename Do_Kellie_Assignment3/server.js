/* Kellie Do's Assignment 3 Server.js May 14, 2021
Referenced Lab 13, Lab 14 and Assignment 1 & 2 examples
Validation copied from W3 Schools
*/

var data = require("./public/product_data.js"); // get product_data.js
var products = data.products; // set data from product_data.js and set to variable products

var express = require('express'); // load express module
var app = express(); // starts express
var queryString = require('query-string'); // load querystring
var fs = require('fs'); // use the file system module 
var filename = 'user_data.json'; // set filename variable
var nodemailer = require('nodemailer'); // load nodemailer
var session = require("express-session"); // use the express-session module

var myParser = require("body-parser"); // load parser module
app.use(myParser.urlencoded({ extended: true })); // taken from lab 13, starts parser

var cookieParser = require('cookie-parser'); // load cookie module
app.use(cookieParser());  // use cookieparser

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path); // display in console the request method and path
  next(); // continue
});

app.get("/cart.html", function (request, response) {
  cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`; // load in cart page
  cartfile += fs.readFileSync('./public/cart.html', 'utf-8'); 
  response.send(cartfile); // send cartfile
});

app.post("/checkout", function (request, response) {
  var user_email = userdata[request.cookies.username].email;
  var user_name = userdata[request.cookies.username].fullname

  invoice_str =
    `<header align="center">
    <!-- Center header on page -->
    <h1>Purchase Complete</h1>
    <hr /> 
    </header>
        <h3 align="center">Thank you for your purchase, <font color="#629DD1">${user_name}!</font><br />An email copy has been sent to <font color="#629DD1">${user_email}</font></h3>
            <section id="one" class="wrapper style1">
          <table>
            <tbody>
            <tr>
                            <td style="text-align: left;" width="40%"><strong>Product</strong></td>
                            <td width="20%"><strong>Quantity</strong></td>
                            <td width="20%"><strong>Price</strong></td>
                            <td width="20%"><strong>Extended Price</strong></td>
                        </tr>`;

  subtotal = 0; //subtotal starts off as 0
  for (product in products) {
    for (i = 0; i < products[product].length; i++) {

      qty = cart[`${product}${i}`];
      if (qty > 0) { //if a quantity is entered in the textbox 
        extended_price = qty * products[product][i].price //equation for extended price
        subtotal += extended_price; //adds each subtotatl to get the the extrended price 

        str += `
                                    <tr>
                                        <td style= "text-align: left" width="40%">${products[product][i].name}</td>
                                        <td width="20%">${qty}</td>
                                        <td width="20%">\$${products[product][i].price}</td>
                                        <td  width="20%">\$${extended_price.toFixed(2)}</td>
                                    </tr>
                                `;
      }
    };
  }
  //compute tax information
  var tax_rate = 0.0471;
  var tax = tax_rate * subtotal;
  // Compute shipping
  if (subtotal <= 50) {
    shipping = 2;
  }
  else if (subtotal <= 100) {
    shipping = 5;
  }
  else {
    shipping = 0.05 * subtotal; // 5% of subtotal
  }
  // Compute grand total
  var total = subtotal + tax + shipping;

  str += `
                          <tr>
                          <td colspan="4" width="100%">&nbsp;</td>
                        </tr>
                        <tr>
                          <td colspan="3" width="67%">Sub-total</td>
                          <td width="54%">${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td  colspan="3" width="67%"><span>Tax at ${100 * tax_rate}%</span></td>
                          <td width="54%">${tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td  colspan="3" width="67%">Shipping</span></td>
                            <td width="54%">${shipping.toFixed(2)}</td>
                          </tr>
                        <tr>
                          <td colspan="3" width="67%"><strong>Total</strong></td>
                          <td width="54%"><strong>${total.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                          <td style="text-align: center;" colspan="4"> <strong>
                          OUR SHIPPING POLICY IS: A subtotal $0 - $49.99 will be $2 shipping
                            A subtotal $50 - $99.99 will be $5 shipping
                            Subtotals over $100 will be charged 5% of the subtotal amount</strong>
                          </td>
                      </tr>
                  </tbody>
                    </table> 
                  </section>`;

// taken from assignment 3 code examples linked here: https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html
// set up a mail server; only works on UH network for security reasons
  var transporter = nodemailer.createTransport({ 
    host: 'mail.hawaii.edu', 
    port: 25,
    secure: false, // use tls
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: 'ksstickershop@gmail.com', // fake email
    to: email, 
    subject: 'Ks Sticker Shop Invoice',
    html: str 
  };
  // if there are errors, display error in console
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  response.send(str); 
});


// taken from lab 15
app.use(session({
  secret: 'ITM352 Rocks!', // encrypts the session 
  resave: true, // saves the session
  saveUninitialized: false, // deletes or forgets session when it is done
  httpOnly: false, // doesnt allow access of cookies 
  secure: true, // only uses cookies in HTTPS
  ephemeral: true // this deletes this cookie when browser is closed 
}));

// taken from lab 14, checks to see if user_data.json exists
if (fs.existsSync(filename)) { // if file exists
  data = fs.readFileSync(filename, 'utf-8'); // read file
  users_reg_data = JSON.parse(data); // set it to variable users_reg_data
} else {
  console.log(filename + 'does not exist!'); // output in console file does not exist
}

// assignment 1 examples
app.post("/process_form", function (request, response) { 
  let POST = request.body; // take the data and package it in the body
  if (typeof POST['addProducts${i}'] != 'undefined') { 
      var hasvalidquantities = true; // assume has valid quantities
      var hasquantities = false; // assume there are quantities
      for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { 
          qty = POST[`quantity_textbox${i}`]; 
          if (qty > 0) { // if quantity is greater than zero...
              hasquantities = true; // has valid quantities
          }
          if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
              hasvalidquantities = false; // it is not a valid amount
          }
      }
      const stringified = queryString.stringify(POST); // converts to json
      if (hasvalidquantities && hasquantities) { // if quantities are valid
          response.redirect("./login.html?" + stringified); // go to login page
          return; //stops function
      }
      else { response.redirect("./index.html?" + stringified) } // go to index.html
  }
});

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
          response.redirect('/cart.html?' + queryString.stringify(request.query)); // if username and password is valid, go to cart
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
// when registration data is valid, will proceed to cart
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
    res.redirect('./cart.html?' + queryString.stringify(req.query)); // go to cart.html
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

// function to logout
app.post('/logout', function (request, response) {
  request.session.reset(); // reset the session
  response.redirect('/index.html'); // go back to index.html
});

app.use(express.static('./public')); // serve files from public directory in static route
app.listen(8080, () => console.log(`listening on port 8080`)); // run server on port8080