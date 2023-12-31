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
const flash = require('express-flash');


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

//used for error messages
app.use(flash());


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

//student signup
app.get("/signup", async (req,res) => {
  res.render('signup');
});

//adding student signup credentials to database
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Regular expression to check password requirements
  // Must contain at least one uppercase and lower case letter, one digit 
  //and be at least 8 characters long
  const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Check if the password meets the requirements
  if (!password.match(passwordCheck)) {
    return res.render('signup', {error: 'Password must contain at least 1 lowercase and uppercase letter, 1 number and be at least 8 characters long. Please enter a new password'});

  }

  // Check if the email contains "@"
  if (!email.includes('@')) {
    console.log('Invalid email format:', email);
    return res.render('signup', {error: 'Your email must include an @ symbol. Please enter a valid email'});
  }


  // Query to check if the users email already exists in the database
  db.query(
    `SELECT COUNT(*) AS count FROM students WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.render('signup', {error: 'This email already exists. Please enter another email'});
      }

      // If the email already exists, inform the student to provide a different email
      if (results[0].count > 0) {
        return res.render('signup', {error: 'This email already exists. Please enter another email'});
      }

      // If all conditions are met, hash the password and insert user into the database
      const hashedPassword = bcrypt.hashSync(password, 10);

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

// student login
app.get("/login", async (req,res) => {
  res.render('login');
});

app.post('/login', function(req,res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    connection.query(
      'SELECT * FROM students WHERE email = ?',
      [email],
      function(error, rows, fields) {
        if (error) throw error;
        let numrows = rows.length;

        if (numrows > 0) {
          const storedPassword = rows[0].password;
          bcrypt.compare(password, storedPassword, function(err, result) {
            if (err) throw err;

            if (result) {
              req.session.loggedin = true;
              req.session.email = email;
              req.session.student_id = rows[0].id;
              res.redirect('/homepage');
            }else{
              return res.render('login', {error: 'Invalid email or password. Please try again'});
            }
          });
        }else{
          return res.render('login', {error: 'Invalid email or password. Please try again'});
        }
      }
    );
  }else{
    res.send('Enter Email and Password');
  }
});

//teacher signup
app.get("/teachers_signup", async (req,res) => {
  res.render('teachers_signup');
});

//adding teacher signup credentials to database
app.post('/teachers_signup', (req, res) => {
  const { name, email, password } = req.body;

  // Regular expression to check password requirements
  // Must contain at least one uppercase and lower case letter, one digit 
  //and be at least 8 characters long
  const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Check if the password meets the requirements
  if (!password.match(passwordCheck)) {
    return res.render('teachers_signup', {error: 'Password must contain at least 1 lowercase and uppercase letter, 1 number and be at least 8 characters long. Please enter a new password'});

  }

  // Check if the email contains "@"
  if (!email.includes('@')) {
    console.log('Invalid email format:', email);
    return res.render('teachers_signup', {error: 'Email must contain an @ symbol. Please use a valid format'});
  }


  // Query to check if the teachers email already exists in the database
  db.query(
    `SELECT COUNT(*) AS count FROM teachers WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        req.flash('error', 'This email already exists. Please use another email');
        return res.redirect('/teachers_signup');
      }

      // If the email already exists, inform the teacher to provide a different email
      if (results[0].count > 0) {
        req.flash('error', 'This email already exists. Please use another email');
        return res.redirect('/teachers_signup');
      }

      // If all conditions are met, hash the password and insert teacher into the database
      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        `INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('An error occurred during signup.');
          } else {
            res.redirect('/teacher_login');
          }
        }
      );
    }
  );
});

//teacher login
app.get("/teacher_login", async (req,res) => {
  res.render('teacher_login');
});

app.post('/teacher_login', function(req,res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    connection.query(
      'SELECT * FROM teachers WHERE email = ?',
      [email],
      function(error, rows) {
        if (error) throw error;
        let numrows = rows.length;

        if (numrows > 0) {
          const storedPassword = rows[0].password;
          bcrypt.compare(password, storedPassword, function(err, result) {
            if (err) throw err;

            if (result) {
              req.session.loggedin = true;
              req.session.email = email;
              req.session.student_id = rows[0].id;
              res.redirect('/teacher_homepage');
            }else{
              return res.render('teacher_login', {error: 'Invalid email or password. Please try again'});
            }
          });
        }else{
          return res.render('teacher_login', {error: 'Invalid email or password. Please try again'});
        }
      }
    );
  }else{
    res.send('Enter Email and Password');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});


//server
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on //localhost:3000/ ");