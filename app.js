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


//index page
app.get("/", (req,res) => {
      res.render('index');
  });

app.get("/homepage", (req, res) => {
  let readsql = "SELECT id, name, image FROM subjects";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let rowdata = rows;
      let loggedIn = req.session.loggedin;
      res.render('homepage', { title: 'Homepage', rowdata, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load homepage');
    }
  });
});

// topics
app.get("/topics", (req, res) => {
  let readsql = "SELECT id, name, subject_type, image FROM topics";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('topics', { title: 'Topics', topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//profile page
app.get("/profile", (req,res) => {
  res.render('profile');
});

//update profile page
app.get("/update_profile", (req,res) => {
  res.render('update_profile');
});

//signup
app.get("/signup", async (req,res) => {
  res.render('signup');
});

//login
app.get("/login", async (req,res) => {
  res.render('login');
});


//server
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on //localhost:3000/ ");