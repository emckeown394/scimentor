const express = require("express");
let app = express();
const connection = require("./connection.js");
const mysql  = require('mysql');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
//for hashing passwords
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { name } = require("ejs");


// Database connection
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scimentor',
    port: '3306'
});

db.connect((err)=> {
    if(err) throw err;
});



//middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname,+ "/public"));
app.use(session({
    secret: 'sw-dev-2023', 
    resave: false,
    saveUninitialized: true
  }));
app.use(bodyParser.urlencoded({ extended: true}));


//homepage
app.get("/", (req,res) => {
    const loggedin = req.session.loggedin || false;
      res.render('homepage', {loggedin});
  });

app.get("/signup", async (req,res) => {
  res.render('signup');
});

app.get("/login", async (req,res) => {
  res.render('login');
});


//server
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on //localhost:3000/ ");