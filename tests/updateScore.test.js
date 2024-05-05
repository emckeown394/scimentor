const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// Mock database connection
const db = require('../connection');
jest.mock('../connection', () => ({
  query: jest.fn()
}));

// Mock db.query to simulate a database error for the score fetching
db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes('SELECT biology_score FROM students_scores WHERE student_id = ?')) {
      callback(new Error('Database error'), null); // Simulate a database error
    } else {
      callback(null, { affectedRows: 1 });
    }
  });

// Mock the authentication middleware
const isAuthenticated = jest.fn((req, res, next) => {
  if (req.session) {
    req.session.student_id = 1; 
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}));
app.use(isAuthenticated);

app.engine('html', (path, options, callback) => {
    callback(null, 'rendered content');
});
app.set('views', './views');
app.set('view engine', 'html');


// Route to test
app.post('/api/biology_scores', (req, res) => {
  const { studentId } = req.session;
  const { bio_score } = req.body;

  const checkQuery = 'SELECT biology_score FROM students_scores WHERE student_id = ?';
  db.query(checkQuery, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching existing biology score:', err);
      return res.status(500).send('Error checking for existing biology score.');
    }

    if (results.length > 0) {
      const existingScore = results[0].biology_score;
      if (bio_score > existingScore) {
        const updateQuery = 'UPDATE students_scores SET biology_score = ? WHERE student_id = ?';
        db.query(updateQuery, [bio_score, studentId], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating biology score:', updateErr);
            return res.status(500).send('Error updating biology score.');
          }
          res.json('Biology score updated successfully.');
        });
      } else {
        res.json('Existing biology score is higher or equal; not updated.');
      }
    } else {
      const insertQuery = 'INSERT INTO students_scores (student_id, biology_score) VALUES (?, ?)';
      db.query(insertQuery, [studentId, bio_score], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error inserting new biology score:', insertErr);
          return res.status(500).send('Error inserting new biology score.');
        }
        res.json('New biology score added successfully.');
      });
    }
  });
});

app.response.render = function(view, options) {
    this.type('json').send({ view, options });
};

describe('POST /api/biology_scores', () => {
    beforeEach(() => {
      db.query.mockReset();
    });
  
    it('should insert a new biology score if no existing score', async () => {
      db.query.mockImplementationOnce((sql, params, callback) => callback(null, []))  // No existing scores
                        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 }));  // Successful insert
  
      const res = await request(app)
        .post('/api/biology_scores')
        .send({ bio_score: 85 })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
  
      expect(res.status).toBe(200);
      expect(res.text).toBe('\"New biology score added successfully.\"');
    });
  
    it('should update existing score if the new score is higher', async () => {
      db.query.mockImplementationOnce((sql, params, callback) => callback(null, [{ biology_score: 80 }]))  // Existing lower score
                        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 }));  // Successful update
  
      const res = await request(app)
        .post('/api/biology_scores')
        .send({ bio_score: 90 })
        .set('Accept', 'application/json');
  
      expect(res.status).toBe(200);
      expect(res.text).toBe('\"Biology score updated successfully.\"');
    });
  
    it('should not update the score if the existing score is higher', async () => {
      db.query.mockImplementationOnce((sql, params, callback) => callback(null, [{ biology_score: 95 }]));  // Existing higher score
  
      const res = await request(app)
        .post('/api/biology_scores')
        .send({ bio_score: 90 })
        .set('Accept', 'application/json');
  
      expect(res.status).toBe(200);
      expect(res.text).toBe('\"Existing biology score is higher or equal; not updated.\"');
    });
});