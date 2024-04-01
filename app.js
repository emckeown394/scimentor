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
const saltRounds = 10;
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

//function to see if student is logged in
function isAuthenticated(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
  }
}

//function to see if teacher is logged in
function isTAuthenticated(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/teacher_login');
  }
}

app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.loggedin;
  next();
});

//middleware to fetch user image for all templates
app.use((req, res, next) => {
  if (req.session.student_id) {
    const studentId = req.session.student_id;
    const query = "SELECT image FROM students WHERE id = ?";
    connection.query(query, [studentId], (err, results) => {
      if (err) {
        console.error("Error fetching user image:", err);
        next();
      } else {
        res.locals.userImage = results.length > 0 ? results[0].image : null;
        next();
      }
    });
  } else {
    next();
  }
});

//index page
app.get("/", (req,res) => {
  res.render('index');
});

//header
app.get("/header", (req, res) => {
  res.render('header');
});

//logo top
app.get("/logo_top", (req,res) => {
  res.render('logo_top');
});



//Students Section  


//student signup
app.get("/signup", async (req,res) => {
  res.render('signup');
});

//adding student signup credentials to database
app.post('/signup', (req, res) => {
  const { name, email, password, profileImage } = req.body;

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
        `INSERT INTO students (name, email, password, image) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, profileImage],
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

              req.session.userType = 'student'; 
              console.log(`Logged in student_id: ${req.session.student_id}`);

              const studentId = req.session.student_id;
              const { last_login_date, login_streak } = db.query('SELECT last_login_date, login_streak FROM students WHERE id = ?', [studentId]);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const lastLoginDate = new Date(last_login_date);
              lastLoginDate.setHours(0, 0, 0, 0);
              
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              yesterday.setHours(0, 0, 0, 0);
              
              let newStreak = login_streak;
  
              if (lastLoginDate.toString() === yesterday.toString()) {
                // If last login was yesterday, increase the streak
                newStreak++;
              } else if (lastLoginDate < yesterday) {
                // If last login was before yesterday, reset the streak
                newStreak = 1;
              }
              
              // Update last_login_date and login_streak in the database
              db.query(
                'UPDATE students SET last_login_date = ?, login_streak = ? WHERE id = ?',
                [today, newStreak, studentId]
                );

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

//reset password
app.get("/reset_password", async (req,res) => {
  res.render('reset_password');
});

app.post('/reset_password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
      return res.status(400).send('Email and new password are required.');
  }

  try {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      const updateQuery = 'UPDATE students SET password = ? WHERE email = ?';
      const result = await db.query(updateQuery, [hashedPassword, email]);

      if (result.affectedRows === 0) {
          return res.status(404).send('Email not found.');
      }

      res.redirect('/login');
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).send('Error resetting password.');
  }
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
  const subjectId = req.params.subjectId;
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

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

//profile page
app.get("/profile", isAuthenticated, async (req, res) => {
  const studentId = req.session.student_id;

  try {
    const userDetailsResult = await queryAsync('SELECT name, email, image, login_streak FROM students WHERE id = ?', [studentId]);
    if (userDetailsResult.length === 0) {
      console.log('No user found with that ID');
      return res.redirect('/login');
    }
    const userDetails = userDetailsResult[0];

    const subjectsResult = await queryAsync('SELECT id, name, image FROM subjects');
    const scoresResult = await queryAsync('SELECT * FROM students_scores WHERE student_id = ?', [studentId]);

    let scoresMap = {};
    if (scoresResult.length > 0) {
      scoresMap = scoresResult[0];
    }

    const maxScores = {
      biology: 16,
      chemistry: 20,
      physics: 20,
    };

    subjectsResult.forEach(subject => {
      const subjectName = subject.name.toLowerCase();
      subject.score = scoresMap[`${subjectName}_score`] || 0; // Get the score for the subject, default to 0 if not found
      subject.maxScore = maxScores[subjectName];
      
      if (subject.score >= subject.maxScore) {
        subject.unlockedBadge = `/images/badges/${subjectName}_unlocked.png`;
      } else {
        subject.lockedBadge = `/images/badges/${subjectName}_locked.png`;
      }
    });

    res.render("profile", {
      name: userDetails.name,
      email: userDetails.email,
      userImage: userDetails.image,
      loginStreak: userDetails.login_streak,
      rowdata: subjectsResult,
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).send('Error loading profile');
  }
});

//update profile page
app.get("/update_profile", isAuthenticated, (req,res) => {
  res.render('update_profile');
});

app.post('/update-profile', async (req, res) => {
  const { name, email, password, profileImage } = req.body;
  const studentId = req.session.student_id;

  // Initialize parts of the query based on provided fields
  let updateParts = [];
  let queryParams = [];

  if (name) {
    updateParts.push('name = ?');
    queryParams.push(name);
  }

  if (email) {
    updateParts.push('email = ?');
    queryParams.push(email);
  }

  if (profileImage) {
    updateParts.push('image = ?');
    queryParams.push(profileImage);
  }

  // if (password) {
  //   const passwordString = String(password).trim(); // Convert to string and then trim
  //   if(passwordString.length > 0) { // Check that the trimmed string is not empty
  //       const hashedPassword = bcrypt.hashSync(passwordString, 10);
  //       updateParts.push('password = ?');
  //       queryParams.push(hashedPassword);
  //   }
  // }

  // // Only proceed if there are parts of the query to update
  if (updateParts.length > 0) {
    queryParams.push(studentId);
    const updateQuery = `UPDATE students SET ${updateParts.join(', ')} WHERE id = ?`;

    db.query(updateQuery, queryParams, (error) => {
      if (error) {
        console.error('Error updating profile:', error);
        return res.status(500).send({ message: 'Failed to update profile.' });
      }
      console.log('Profile updated successfully');
      return res.redirect('/profile');
    });
  } else {
    res.status(400).send({ message: 'No fields provided for update.' });
  }
});

//progress page
app.get("/progress", isAuthenticated, (req, res) => {
  const studentId = req.session.student_id;
  const userName = req.session.user ? req.session.user.name : "Guest";

  // Query to select biology, chemistry, and physics scores
  const query = 'SELECT biology_score, chemistry_score, physics_score FROM students_scores WHERE student_id = ?';
  
  connection.query(query, [studentId], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Error fetching user scores");
    }

    // Extract scores from query results, defaulting to 'No score available' if not found
    const scores = results[0] ? results[0] : { biology_score: 'No score available', chemistry_score: 'No score available', physics_score: 'No score available' };

    let bioScorePercentage = (scores.biology_score / 16) * 100;
    let chemScorePercentage = (scores.chemistry_score / 20) * 100;
    let phyScorePercentage = (scores.physics_score / 20) * 100;

    function getScoreImage(score, subject) {
      let basePath = `/progress_img/${subject}_`;
      let scorePercentage = isNaN(score) ? 0 : parseFloat(score);
      if (scorePercentage >= 1 && scorePercentage <= 25) {
        return `${basePath}25.png`;
    } else if (scorePercentage >= 26 && scorePercentage <= 50) {
        return `${basePath}50.png`;
    } else if (scorePercentage >= 51 && scorePercentage <= 99) {
        return `${basePath}75.png`;
    } else if (scorePercentage >= 100) {
        return `${basePath}100.png`;
    } else {
        return `${basePath}0.png`;
    }
  }

  const bioScoreImg = getScoreImage(bioScorePercentage, 'bio');
  const chemScoreImg = getScoreImage(chemScorePercentage, 'chem');
  const phyScoreImg = getScoreImage(phyScorePercentage, 'phy');
    
    // Render the progress page with the user's name and scores
    res.render("progress", {
      name: userName,
      studentId: studentId,
      biologyScore: scores.biology_score || 'No score available',
      chemistryScore: scores.chemistry_score || 'No score available',
      physicsScore: scores.physics_score || 'No score available',
      bioScoreImg: bioScoreImg,
      chemScoreImg: chemScoreImg,
      phyScoreImg: phyScoreImg
    });
  });
});

// student progress report
app.get("/progress_report/:studentId", isAuthenticated, async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Fetch student details
    const userDetailsResult = await queryAsync('SELECT name, email, image, login_streak FROM students WHERE id = ?', [studentId]);
    if (userDetailsResult.length === 0) {
      console.log('No user found with that ID');
      return res.redirect('/login');
    }
    const userDetails = userDetailsResult[0];

    // Fetch scores
    const scoresResult = await queryAsync('SELECT biology_score, chemistry_score, physics_score FROM students_scores WHERE student_id = ?', [studentId]);
    const scores = scoresResult.length > 0 ? scoresResult[0] : { biology_score: 'No score available', chemistry_score: 'No score available', physics_score: 'No score available' };

    // Function to calculate image paths
    function getScoreImage(score, subject) {
      let basePath = `/progress_img/${subject}_`;
      let scorePercentage = isNaN(score) ? 0 : parseFloat(score);
      if (scorePercentage >= 1 && scorePercentage <= 25) {
        return `${basePath}25.png`;
      } else if (scorePercentage > 25 && scorePercentage <= 50) {
        return `${basePath}50.png`;
      } else if (scorePercentage > 50 && scorePercentage < 100) {
        return `${basePath}75.png`;
      } else if (scorePercentage >= 100) {
        return `${basePath}100.png`;
      } else {
        return `${basePath}0.png`;
      }
    }

    let bioScorePercentage = (scores.biology_score / 16) * 100;
    let chemScorePercentage = (scores.chemistry_score / 20) * 100;
    let phyScorePercentage = (scores.physics_score / 20) * 100;

    const bioScoreImg = getScoreImage(bioScorePercentage, 'bio');
    const chemScoreImg = getScoreImage(chemScorePercentage, 'chem');
    const phyScoreImg = getScoreImage(phyScorePercentage, 'phy');

    // Fetch the latest report
    const reportResult = await queryAsync(`
    SELECT r.*, t.name as teacherName 
    FROM reports r
    INNER JOIN teachers t ON r.teacherId = t.id
    WHERE r.studentId = ? 
    ORDER BY r.created_at DESC 
    LIMIT 1
  `, [studentId]);
    const report = reportResult.length > 0 ? reportResult[0] : null;

    // Render the page
    res.render("progress_report", {
      student: userDetails,
      scores: scores,
      biologyScore: scores.biology_score || 'No score available',
      chemistryScore: scores.chemistry_score || 'No score available',
      physicsScore: scores.physics_score || 'No score available',
      bioScoreImg: bioScoreImg,
      chemScoreImg: chemScoreImg,
      phyScoreImg: phyScoreImg,
      report: report,
      teacherName: report.teacherName
    });
  } catch (error) {
    console.error('Failed to fetch details:', error);
    res.status(500).send('Server error');
  }
});

//cells
app.get("/topics/1", (req, res) => {
  const userType = req.session.userType;
  const topicId = req.params.id;
  let readsql = "SELECT id, name, subject_type, image FROM topics WHERE id = '1'";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      console.log(userType);
      res.render('cells', { title: 'Animal and Plant Cells', userType: userType, topicId, topicData, loggedIn });
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


//Quiz Section


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
  const studentId = req.session.student_id;
  const { bio_score } = req.body;

  console.log(`Logging Score: ${bio_score} for Student ID: ${studentId}`);

  // Query to check if there's already a biology score for this user
  const checkQuery = 'SELECT biology_score FROM students_scores WHERE student_id = ?';

  connection.query(checkQuery, [studentId], (err, results) => {
      if (err) {
          console.error('Error fetching existing biology score:', err);
          return res.status(500).send('Error checking for existing biology score.');
      }

      if (results.length > 0) {
          // There's an existing score, update it only if the new score is higher
          const existingScore = results[0].biology_score;
          if (bio_score > existingScore) {
              // New score is higher, update it
              const updateQuery = 'UPDATE students_scores SET biology_score = ? WHERE student_id = ?';
              connection.query(updateQuery, [bio_score, studentId], (updateErr, updateResults) => {
                  if (updateErr) {
                      console.error('Error updating biology score:', updateErr);
                      return res.status(500).send('Error updating biology score.');
                  }
                  res.send('Biology score updated successfully.');
              });
          } else {
              // New score is not higher, do not update
              res.send('Existing biology score is higher or equal; not updated.');
          }
      } else {
          // No existing score, insert the new score
          const insertQuery = 'INSERT INTO students_scores (student_id, biology_score) VALUES (?, ?)';
          connection.query(insertQuery, [studentId, bio_score], (insertErr, insertResults) => {
              if (insertErr) {
                  console.error('Error inserting new biology score:', insertErr);
                  return res.status(500).send('Error inserting new biology score.');
              }
              res.send('New biology score added successfully.');
          });
      }
  });
});

app.post('/api/chemistry_scores', (req, res) => {
  const studentId = req.session.student_id;
  const { chem_score } = req.body;

  console.log(`Logging Score: ${chem_score} for Student ID: ${studentId}`);

  // Query to check if there's already a chemistry score for this user
  const checkQuery = 'SELECT chemistry_score FROM students_scores WHERE student_id = ?';

  connection.query(checkQuery, [studentId], (err, results) => {
      if (err) {
          console.error('Error fetching existing chemistry score:', err);
          return res.status(500).send('Error checking for existing chemistry score.');
      }

      if (results.length > 0) {
          // There's an existing score, update it only if the new score is higher
          const existingScore = results[0].chemistry_score;
          if (chem_score > existingScore) {
              // New score is higher, update it
              const updateQuery = 'UPDATE students_scores SET chemistry_score = ? WHERE student_id = ?';
              connection.query(updateQuery, [chem_score, studentId], (updateErr, updateResults) => {
                  if (updateErr) {
                      console.error('Error updating chemistry score:', updateErr);
                      return res.status(500).send('Error updating chemistry score.');
                  }
                  res.send('Chemistry score updated successfully.');
              });
          } else {
              // New score is not higher, do not update
              res.send('Existing chemistry score is higher or equal; not updated.');
          }
      } else {
          // No existing score, insert the new score
          const insertQuery = 'INSERT INTO students_scores (student_id, chemistry_score) VALUES (?, ?)';
          connection.query(insertQuery, [studentId, chem_score], (insertErr, insertResults) => {
              if (insertErr) {
                  console.error('Error inserting new chemistry score:', insertErr);
                  return res.status(500).send('Error inserting new chemistry score.');
              }
              res.send('New chemistry score added successfully.');
          });
      }
  });
});

app.post('/api/physics_scores', (req, res) => {
  const studentId = req.session.student_id;
  const { phy_score } = req.body;

  console.log(`Logging Score: ${phy_score} for Student ID: ${studentId}`);

  // Query to check if there's already a physics score for this user
  const checkQuery = 'SELECT physics_score FROM students_scores WHERE student_id = ?';

  connection.query(checkQuery, [studentId], (err, results) => {
      if (err) {
          console.error('Error fetching existing physics score:', err);
          return res.status(500).send('Error checking for existing physics score.');
      }

      if (results.length > 0) {
          // There's an existing score, update it only if the new score is higher
          const existingScore = results[0].physics_score;
          if (phy_score > existingScore) {
              // New score is higher, update it
              const updateQuery = 'UPDATE students_scores SET physics_score = ? WHERE student_id = ?';
              connection.query(updateQuery, [phy_score, studentId], (updateErr, updateResults) => {
                  if (updateErr) {
                      console.error('Error updating physics score:', updateErr);
                      return res.status(500).send('Error updating physics score.');
                  }
                  res.send('Physics score updated successfully.');
              });
          } else {
              // New score is not higher, do not update
              res.send('Existing physics score is higher or equal; not updated.');
          }
      } else {
          // No existing score, insert the new score
          const insertQuery = 'INSERT INTO students_scores (student_id, physics_score) VALUES (?, ?)';
          connection.query(insertQuery, [studentId, phy_score], (insertErr, insertResults) => {
              if (insertErr) {
                  console.error('Error inserting new physics score:', insertErr);
                  return res.status(500).send('Error inserting new physics score.');
              }
              res.send('New physcis score added successfully.');
          });
      }
  });
});


//Teacher Section

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
              req.session.teacher_id = rows[0].id;
              req.session.userType = 'teacher'; 
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

//create subject
app.get("/create_subject", isTAuthenticated, async (req,res) => {
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
app.get("/create_topic", isTAuthenticated, async (req,res) => {
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

//teacher profile
app.get("/teacher_profile", isTAuthenticated, async (req, res) => {
  const teacherId = req.session.teacher_id;

  try {
    const teacherDetailsResult = await queryAsync('SELECT name, email FROM teachers WHERE id = ?', [teacherId]);
    if (teacherDetailsResult.length === 0) {
      console.log('No teacher found with that ID');
      return res.redirect('/teacher_login');
    }
    const teacherDetails = teacherDetailsResult[0];

    const studentResult = await queryAsync('SELECT id, name, image FROM students');

    res.render("teacher_profile", {
      email: teacherDetails.email,
      rowdata: studentResult,
    });
  } catch (error) {
    console.error('Error loading teacher profile:', error);
    res.status(500).send('Error loading teacher profile');
  }
});

//reports
app.get("/reports/:studentId", isTAuthenticated, async (req, res) => {
  const studentId = req.params.studentId;
  const teacherId = req.session.teacher_id;

  console.log(`Student: ${studentId} Teacher: ${teacherId}`);

  // Fetch student information
  const studentQuery = 'SELECT id, name, image FROM students WHERE id = ?';
  db.query(studentQuery, [studentId], (studentErr, studentResults) => {
    if (studentErr || studentResults.length === 0) {
      return res.status(500).send('Error fetching student information');
    }

    const student = studentResults[0];

    // Fetch quiz scores for the student
    const scoresQuery = 'SELECT biology_score, chemistry_score, physics_score FROM students_scores WHERE student_id = ?';
    db.query(scoresQuery, [studentId], (scoresErr, scoresResults) => {
      if (scoresErr) {
        console.error('Error fetching scores:', scoresErr);
        return res.status(500).send('Error fetching student scores');
      }

      const scores = scoresResults.length > 0 ? scoresResults[0] : {biology_score: 0, chemistry_score: 0, physics_score: 0};

      // Calculate the image paths based on the scores
      const images = {
        biology: getScoreImage(scores.biology_score, 'bio'),
        chemistry: getScoreImage(scores.chemistry_score, 'chem'),
        physics: getScoreImage(scores.physics_score, 'phy')
      };

      // Render the report page with the fetched data
      res.render('reports', {
        teacherId: teacherId,
        student: student,
        scores: scores,
        images: images
      });
    });
  });
});

function getScoreImage(score, subject) {
  let basePath = `/progress_img/${subject}_`;
  let scorePercentage = (score / maximumScoreForSubject(subject)) * 100; 
  if (scorePercentage >= 1 && scorePercentage <= 25) {
    return `${basePath}25.png`;
} else if (scorePercentage >= 26 && scorePercentage <= 50) {
    return `${basePath}50.png`;
} else if (scorePercentage >= 51 && scorePercentage <= 99) {
    return `${basePath}75.png`;
} else if (scorePercentage >= 100) {
    return `${basePath}100.png`;
} else {
    return `${basePath}0.png`;
}
}

function maximumScoreForSubject(subject) {
  switch (subject) {
    case 'bio': return 16;
    case 'chem': return 20;
    case 'phy': return 20;
    default: return 100;
  }
}

//students
app.get("/students", isTAuthenticated, async (req, res) => {
  try {
    const query = 'SELECT id, name, image FROM students';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).send('Error fetching student list');
      }
      res.render('students', { rowdata: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load the students page');
  }
});


//post report to database
app.post('/api/reports/:studentId', (req, res) => {

  const { studentId } = req.params;
  const teacherId = req.session.teacher_id;
  const { specialEdNeed, content } = req.body;

  if (!studentId || !teacherId || !specialEdNeed || !content) {
      return res.status(400).send({ message: 'Missing required report fields.' });
  }

  const insertReportQuery = `
      INSERT INTO reports (studentId, teacherId, SEN, content)
      VALUES (?, ?, ?, ?)
  `;

  db.query(insertReportQuery, [studentId, teacherId, specialEdNeed, content], (err, result) => {
    if (err) {
        console.error('Error inserting report into the database:', err);
        return res.status(500).send({ message: 'Failed to create report.' });
    }
    console.log(`Report created successfully. Report ID: ${result.insertId}`);
    res.redirect('/students');
  });
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});