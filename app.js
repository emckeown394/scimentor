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

//adding signup credentials to database
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Regular expression to check password requirements
  // Must contain at least one uppercase and lower case letter, one digit 
  //and be at least 8 characters long
  const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Check if the password meets the requirements
  if (!password.match(passwordCheck)) {
    return res.status(400).send('<code>Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, and a number.</code> <a href="/signup" class="button">BACK</a>');

  }

  // Check if the email contains "@"
  if (!email.includes('@')) {
    console.log('Invalid email format:', email);
    return res.status(400).send('<code>Invalid email format. Please provide a valid email address.</code> <a href="/signup" class="button">BACK</a>');
  }


  // Query to check if the users email already exists in the database
  db.query(
    `SELECT COUNT(*) AS count FROM students WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(400).send('<code>This email already exists. Please use another email.</code> <a href="/signup" class="button">BACK</a>');
      }

      // If the email already exists, inform the student to provide a different email
      if (results[0].count > 0) {
        return res.status(400).send('Email already taken. Please use another email.');
      }

      // If all conditions are met, hash the password and insert user into the database
      const hashedPassword = bcrypt.hashSync(password, 10);

      console.log('Hashed Password:', hashedPassword)

      db.query(
        `INSERT INTO students (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('An error occurred during signup.');
          } else {
            res.redirect('/login');
          }
        }
      );
    }
  );
});

//login
app.get("/login", async (req,res) => {
  res.render('login');
});


//server
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on //localhost:3000/ ");