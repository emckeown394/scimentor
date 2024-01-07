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

//server
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on //localhost:3000/ ");


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

//header
app.get("/header", (req, res) => {
  res.render("header");
});

//logo top
app.get("/logo_top", (req,res) => {
  res.render('logo_top');
});

//student homepage
app.get("/homepage", (req, res) => {
  let readsql = "SELECT id, name, image FROM subjects";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let rowdata = rows;
      let loggedIn = req.session.loggedin;
      res.render('homepage', { title: 'Student Homepage', rowdata, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load student homepage');
    }
  });
});

//teacher homepage
app.get("/teacher_homepage", (req, res) => {
  let readsql = "SELECT id, name, image FROM subjects";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let rowdata = rows;
      let loggedIn = req.session.loggedin;
      res.render('teacher_homepage', { title: 'Teacher Homepage', rowdata, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load teacher homepage');
    }
  });
});

//all topics
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

//biology topics
app.get('/topic/:subjectId', (req, res) => {
  const subjectId = req.params.subjectId;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_type) = 'biology'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('biology_topics', { title: 'Biology Topics', subjectId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load biology topics page');
    }
  });
});

//chemistry topics
app.get('/topic/:subjectId', (req, res) => {
  const subjectId = req.params.subject_id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_type) = 'chemistry'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('chemistry_topics', { title: 'Chemistry Topics', subjectId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load chemistry topics page');
    }
  });
});

//physics topics
app.get("/physics_topics", (req, res) => {
  const subjectId = req.params.subject_id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_type) = 'physics'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('physics_topics', { title: 'Physics Topics', subjectId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load physics topics page');
    }
  });
});

//teacher topics
app.get("/teacher_topics", (req, res) => {
  let readsql = "SELECT id, name, subject_type, image FROM topics";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('teacher_topics', { title: 'Teacher Topics', topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//profile page
app.get("/profile", (req, res) => {
  const userName = req.session.user ? req.session.user.name : "Guest";
  res.render("profile", { name: userName });
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

//retrieving login credentials to database
app.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    connection.query(
      'SELECT * FROM students WHERE email = ?',
      [email],
      function (error, rows, fields) {
        if (error) throw error;
        let numrows = rows.length;

        if (numrows > 0) {
          const storedPassword = rows[0].password;
          const userName = rows[0].name;
          const userEmail = rows[0].email;
          const userImg = rows[0].image;

          bcrypt.compare(password, storedPassword, function (err, result) {
            if (err) throw err;

            if (result) {
              // Store user information in the session
              req.session.loggedin = true;
              req.session.email = email;
              req.session.student_id = rows[0].id;
              req.session.user = {
                name: userName,
                email: userEmail,
                image: userImg,
              };

              res.redirect('/homepage');
            } else {
              return res.render('login', { error: 'Invalid email or password. Please try again' });
            }
          });
        } else {
          return res.render('login', { error: 'Invalid email or password. Please try again' });
        }
      }
    );
  } else {
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

//retrieving teacher credentials from database
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

//create subject
app.get("/create_subject", async (req,res) => {
  res.render('create_subject');
});

//adding subject info to database
app.post('/create_subject', (req, res) => {
  const { sub_name, sub_img } = req.body;

  db.query(
    `INSERT INTO subjects (name, image) VALUES (?, ?)`,
    [sub_name, sub_img],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during subject creation.');
      } else {
        res.redirect('/teacher_homepage');
      }
    }
  );
});

//create topic
app.get("/create_topic", async (req,res) => {
  res.render('create_topic');
});

//adding topic info to database
app.post('/create_topic', (req, res) => {
  const { top_name, sub_name, sub_img } = req.body;

  db.query(
    `INSERT INTO topics (name, subject_type, image) VALUES (?, ?, ?)`,
    [top_name, sub_name, sub_img],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during topic creation.');
      } else {
        res.redirect('/teacher_topics');
      }
    }
  );
});

//delete subject
app.delete('/delete_subject/:id', (req, res) => {
  const subjectId = req.params.id;

  db.query(
      'DELETE FROM subjects WHERE id = ?',
      [subjectId],
      (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).json({ message: 'Error deleting subject' });
          } else {
              res.json({ message: 'Subject deleted successfully' });
          }
      }
  );
});

// delete topic
app.delete('/delete_topic/:id', (req, res) => {
  const topicId = req.params.id;

  db.query(
      'DELETE FROM topics WHERE id = ?',
      [topicId],
      (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).json({ message: 'Error deleting topic' });
          } else {
              res.json({ message: 'Topic deleted successfully' });
          }
      }
  );
});


//quiz
app.get("/quiz", async (req,res) => {
  res.render('quiz');
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});