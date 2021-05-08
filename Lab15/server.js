var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({extended: true}));
var qs = require('qs');
var fs = require('fs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');

app.use(session({secret: "ITM352 rocks!"}));

// play with sessions
app.get('/set_session', function(req, res, next) {
    res.send(`welcome, your session ID is ${req.session.id}`);
    next();
});

// play with cookies
app.get('/set_cookie', function(req, res, next) {
    let my_name = 'Kellie Do';
    now = new Date();
    res.cookie('my_name', my_name, {expire: now.getTime()});
    res.send(`Cookie for ${myname} sent`);
    next();
});

// play with cookies
app.get('/use_cookie', function(req, res, next) {
    if(typeof req.cookies["my_name"] != 'undefined') {
        res.send(`Hello ${req.cookies["my_name"]}!`);
    } else {
        res.send("I don't know you!");
    }
    next();
});

// var user_data = require('.user_data.json');
// read user data file
var user_data_file = './user_data.json';
if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${file_stats["size"]}`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}

console.log(user_data);

app.all('*', function (req, res, next ) {
    console.log(req.method, req.path);
    next();
});

// this processes the login form
app.post('/process_login', function (request,response, next) {
    if(typeof request.session['last_login'] != 'undefined') {
        console.log('Last login time was ' + request.session['last_login']);
    } else {
        console.log("first time login");
    }
    request.session['last_login'] = Date();
    console.log(request.body);
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    if(typeof user_data[username_entered] != 'undefined') {
        if(user_data[username_entered]['password'] == password_entered){
            response.cookie('username', username_entered);
            response.send('${username_entered} is logged in');
        } else {
            response.send(`${username_entered} password wrong`);
        }
    } else {
        response.send(`${username_entered} not found`);
    }
});