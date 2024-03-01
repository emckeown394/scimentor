const express = require("express");
let app = express();
//db connection
const connection = require("./connection.js");
const mysql  = require('mysql');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
//for hashing passwords
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { name } = require("ejs");
//message pop-ups
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
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname,+ "/public"));
app.use(session({
    secret: 'sw-dev-2023', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

//used for error messages
app.use(flash());

//load environment variables before they're processed
dotenv.config();

//function to see if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.loggedin) {
    // If the user is authenticated, proceed
    next();
  } else {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
  }
}

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

app.get("/topics/homepage", (req, res) => {
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

app.get("/topics/topics", (req, res) => {
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
app.get('/topic/1', (req, res) => {
  const subjectId = req.params.subjectId;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_id) = '1'";
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
app.get('/topic/2', (req, res) => {
  const subjectId = req.params.subject_id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_id) = '2'";
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
app.get('/topic/6', (req, res) => {
  const subjectId = req.params.subject_id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE LOWER(subject_id) = '6'";
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
app.get("/profile", isAuthenticated, (req, res) => {
  const userName = req.session.user ? req.session.user.name : "Guest";
  res.render("profile", { name: userName });
});

//update profile page
app.get("/update_profile", isAuthenticated, (req,res) => {
  res.render('update_profile');
});

//progress page
app.get("/progress", isAuthenticated, (req, res) => {
  const studentId = req.session.student_id;
  const userName = req.session.user ? req.session.user.name : "Guest"; // Correct use of userName
  // Query to select biology, chemistry, and physics scores
  const query = 'SELECT biology_score, chemistry_score, physics_score FROM students_scores WHERE student_id = ?';
  
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Error fetching user scores");
    }

    // Extract scores from query results, defaulting to 'No score available' if not found
    const scores = results[0] ? results[0] : { biology_score: 'No score available', chemistry_score: 'No score available', physics_score: 'No score available' };

    // Render the progress page with the user's name and scores
    res.render("progress", {
      name: userName, // Use the already defined userName
      biologyScore: scores.biology_score || 'No score available',
      chemistryScore: scores.chemistry_score || 'No score available',
      physicsScore: scores.physics_score || 'No score available'
    });
  });
});

//student signup
app.get("/signup", async (req,res) => {
  res.render('signup');
});

//adding student signup credentials to database
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Regular expression to check password requirements
  // Must contain at least one uppercase and lower case letter, one digit and be at least 8 characters long
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

              console.log(`Logged in student_id: ${req.session.student_id}`);

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
app.get("/create_subject", isAuthenticated, async (req,res) => {
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
app.get("/create_topic", isAuthenticated, async (req,res) => {
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

//reports
app.get("/reports", isAuthenticated, async (req,res) => {
  res.render('reports');
});

//cells
app.get("/topics/1", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '1'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('cells', { title: 'Animal and Plant Cells', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//plants
app.get("/topics/2", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '2'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('plants', { title: 'Plants', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//digestive
app.get("/topics/3", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '3'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('digestive', { title: 'Digestive System', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//materials
app.get("/topics/4", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '4'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('materials', { title: 'Materials', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//rocks
app.get("/topics/5", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '5'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('rocks', { title: 'Rocks', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//solids, liquids and gases
app.get("/topics/6", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '6'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('states_of_matter', { title: 'Solids, Liquids and Gases', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//changing states
app.get("/topics/7", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '7'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('changing_states', { title: 'Changing States', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//Earth and Space
app.get("/topics/10", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '10'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('space', { title: 'Earth and Space', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});


//light
app.get("/topics/11", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '11'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('light', { title: 'Light', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//magnets
app.get("/topics/12", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '12'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('magnets', { title: 'Magnets', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//sound
app.get("/topics/13", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '13'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('sound', { title: 'Sound', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//electricity
app.get("/topics/14", (req, res) => {
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '14'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('electricity', { title: 'Electricity', topicId, topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

//Quiz page rendering
app.get("/quiz/:subject", isAuthenticated, async (req,res) => {
  const studentId = req.session.student_id;
  const subject = req.params.subject;
  const subjectId = req.params.subjectId;
  res.render('quiz', { studentId: studentId, subject: subject, subjectId: subjectId });
});

//fetching quiz questions and answers
app.get('/api/quiz/:subjectId', async (req, res) => {
  const subjectId = req.params.subjectId;
  const questionsAndChoices = await getQuestionsAndChoicesForSubject(subjectId);
  res.json(questionsAndChoices);
});


app.post('/api/biology_scores', (req, res) => {
  if (req.session.student_id) {
    const student_id = req.session.student_id;
    const { bio_score } = req.body;

    // Check if there's an existing score for the student
    const selectQuery = `SELECT biology_score FROM students_scores WHERE student_id = ? LIMIT 1;`;

    db.query(selectQuery, [student_id], (err, results) => {
      if (err) {
        console.error('Error fetching existing score:', err);
        return res.status(500).send('Error fetching existing score');
      }

      // If a score exists and the new score is higher, update it
      if (results.length > 0 && bio_score > results[0].bio_score) {
        const updateQuery = `UPDATE students_scores SET biology_score = ? WHERE student_id = ?;`;
        db.query(updateQuery, [bio_score, student_id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating score:', updateErr);
            return res.status(500).send('Error updating score');
          }
          console.log('Score updated successfully:', updateResult);
          res.status(200).send('Score updated successfully');
        });
      } else if (results.length === 0) {
        // If no existing score, insert the new score
        const insertQuery = `INSERT INTO students_scores (student_id, biology_score) VALUES (?, ?);`;
        db.query(insertQuery, [student_id, bio_score], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting score:', insertErr);
            return res.status(500).send('Error inserting score');
          }
          console.log('Score inserted successfully:', insertResult);
          res.status(200).send('Score inserted successfully');
        });
      } else {
        // Existing score is higher or equal; do not update
        console.log('Existing score is higher or equal; not updated.');
        res.status(200).send('Score not updated, existing score is higher or equal.');
      }
    });
  } else {
    console.log('Student ID not found in session');
    res.status(403).send('Authentication required');
  }
});

app.post('/api/chemistry_scores', (req, res) => {
  if (req.session.student_id) {
    const student_id = req.session.student_id;
    const { chem_score } = req.body;

    // Check if there's an existing score for the student
    const selectQuery = `SELECT chemistry_score FROM students_scores WHERE student_id = ? LIMIT 1;`;

    db.query(selectQuery, [student_id], (err, results) => {
      if (err) {
        console.error('Error fetching existing score:', err);
        return res.status(500).send('Error fetching existing score');
      }

      // If a score exists and the new score is higher, update it
      if (results.length > 0 && chem_score > results[0].chem_score) {
        const updateQuery = `UPDATE students_scores SET chemistry_score = ? WHERE student_id = ?;`;
        db.query(updateQuery, [chem_score, student_id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating score:', updateErr);
            return res.status(500).send('Error updating score');
          }
          console.log('Score updated successfully:', updateResult);
          res.status(200).send('Score updated successfully');
        });
      } else if (results.length === 0) {
        // If no existing score, insert the new score
        const insertQuery = `INSERT INTO students_scores (student_id, chemistry_score) VALUES (?, ?);`;
        db.query(insertQuery, [student_id, chem_score], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting score:', insertErr);
            return res.status(500).send('Error inserting score');
          }
          console.log('Score inserted successfully:', insertResult);
          res.status(200).send('Score inserted successfully');
        });
      } else {
        // Existing score is higher or equal; do not update
        console.log('Existing score is higher or equal; not updated.');
        res.status(200).send('Score not updated, existing score is higher or equal.');
      }
    });
  } else {
    console.log('Student ID not found in session');
    res.status(403).send('Authentication required');
  }
});

app.post('/api/physics_scores', (req, res) => {
  if (req.session.student_id) {
    const student_id = req.session.student_id;
    const { phy_score } = req.body;

    // Check if there's an existing score for the student
    const selectQuery = `SELECT physics_score FROM students_scores WHERE student_id = ? LIMIT 1;`;

    db.query(selectQuery, [student_id], (err, results) => {
      if (err) {
        console.error('Error fetching existing score:', err);
        return res.status(500).send('Error fetching existing score');
      }

      // If a score exists and the new score is higher, update it
      if (results.length > 0 && phy_score > results[0].phy_score) {
        const updateQuery = `UPDATE students_scores SET physics_score = ? WHERE student_id = ?;`;
        db.query(updateQuery, [phy_score, student_id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating score:', updateErr);
            return res.status(500).send('Error updating score');
          }
          console.log('Score updated successfully:', updateResult);
          res.status(200).send('Score updated successfully');
        });
      } else if (results.length === 0) {
        // If no existing score, insert the new score
        const insertQuery = `INSERT INTO students_scores (student_id, physics_score) VALUES (?, ?);`;
        db.query(insertQuery, [student_id, phy_score], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting score:', insertErr);
            return res.status(500).send('Error inserting score');
          }
          console.log('Score inserted successfully:', insertResult);
          res.status(200).send('Score inserted successfully');
        });
      } else {
        // Existing score is higher or equal; do not update
        console.log('Existing score is higher or equal; not updated.');
        res.status(200).send('Score not updated, existing score is higher or equal.');
      }
    });
  } else {
    console.log('Student ID not found in session');
    res.status(403).send('Authentication required');
  }
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});