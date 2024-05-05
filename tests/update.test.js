const db = require('../connection');
jest.mock('../connection', () => ({
  query: jest.fn()
}));

// Mock the authentication middleware
const isAuthenticated = jest.fn((req, res, next) => {
    req.session = { student_id: 1 };
    next();
});

const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(isAuthenticated);

const mockQuery = jest.fn();
db.query = mockQuery;

beforeEach(() => {
  mockQuery.mockReset();
  mockQuery.mockImplementation((sql, params, callback) => {
    if (params.includes('Error')) {
      callback(new Error('Fake DB error'));
    } else {
      callback(null, { affectedRows: 1 }); // Simulating successful insertion
    }
  });
});

// Mock route for testing
app.post('/update-profile', async (req, res) => {
  const { name, email, profileImage } = req.body;
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

describe('POST /update-profile', () => {
    beforeAll(() => {
      db.query.mockImplementation((sql, params, callback) => {
        if (sql.startsWith('UPDATE students')) {
          return callback(null, { affectedRows: 1 });
        }
        callback(new Error('Query not handled'));
      });
    });
  
    it('should update user profile successfully', async () => {
      const response = await request(app)
        .post('/update-profile')
        .send({ name: 'John Doe', email: 'john@example.com', profileImage: 'path/to/image.jpg' });
  
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/profile');
    });
  
    it('should return 400 if no fields provided for update', async () => {
      const response = await request(app)
        .post('/update-profile')
        .send({});
  
      expect(response.status).toBe(400);
    });

  });