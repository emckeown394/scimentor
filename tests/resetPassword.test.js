const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const db = require('../connection');
let server;

beforeAll((done) => {
  server = app.listen(0, done);  // Listening on a random port
});

afterAll((done) => {
  server.close(done);
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'sw-dev-2023',
    resave: true,
    saveUninitialized: true
}));

// Mock bcrypt
bcrypt.compare = jest.fn();

// Mock db connection
jest.mock('../connection', () => ({
    query: jest.fn().mockImplementation((sql, params, callback) => {
      // Handle SELECT query
      if (sql.includes('SELECT * FROM students WHERE email = ?')) {
        if (params.includes('existingemail@example.com')) {
          // Simulating a scenario where the user exists
          callback(null, [{ id: 1, name: 'Test User', password: 'hashedPassword', email: 'existingemail@example.com' }]);
        } else {
          // Simulating no results found
          callback(null, []);
        }
      } 
      // Handle UPDATE query
      else if (sql.startsWith('UPDATE students SET password = ? WHERE email = ?')) {
        if (params[1] === 'existingemail@example.com') {
          // Simulate an update effect (email exists)
          callback(null, { affectedRows: 1 });
        } else {
          // Simulate no email found for update
          callback(null, { affectedRows: 0 });
        }
      } else {
        // Default to error if the SQL is not expected
        callback(new Error('Query not handled by mock'), null);
      }
    })
  }));
jest.mock('bcryptjs');

const loginRoute = require('../app'); 
app.use(loginRoute);

describe('POST /reset_password', () => {
    beforeEach(() => {
        db.query.mockClear();
        bcrypt.compare.mockClear();
        bcrypt.hashSync.mockReset();
        bcrypt.hashSync.mockReturnValue('hashed_password');
    });

    it('should return 400 if email or newPassword is missing', async () => {
        const app = require('../app'); // Make sure this import comes after jest.mock
        const request = require('supertest');

        const response = await request(app)
            .post('/reset_password')
            .send({ email: '', newPassword: '' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Email and new password are required.');
    });

    it('should redirect to login on successful password reset', async () => {
        db.query.mockResolvedValue({ affectedRows: 1 });
        const response = await request(app)
            .post('/reset_password')
            .send({ email: 'exist@example.com', newPassword: 'newPassword123' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });
});