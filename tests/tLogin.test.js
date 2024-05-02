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
    if (sql.includes('SELECT * FROM teachers WHERE email = ?')) {
      if (params.includes('existingemail@example.com')) {
        // Simulating a scenario where the user exists
        callback(null, [{ id: 1, name: 'Test User', password: 'hashedPassword', email: 'existingemail@example.com' }]);
      } else {
        // Simulating no results found
        callback(null, []);
      }
    } else {
      // Default to error if the SQL is not expected
      callback(new Error('Query not handled by mock'));
    }
  })
}));
jest.mock('bcryptjs');

const loginRoute = require('../app'); 
app.use(loginRoute);

describe('POST /teacher_login', () => {
  beforeEach(() => {
    db.query.mockClear();
    bcrypt.compare.mockClear();
  });

  it('should return 400 if email or password are not provided', async () => {
    const response = await request(app).post('/teacher_login').send({ email: '', password: '' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('Enter Email and Password');
  });

  it('should return 500 if there is a database error', async () => {
    db.query.mockImplementationOnce((sql, params, callback) => callback(new Error('DB error')));
    const response = await request(app).post('/teacher_login').send({ email: 'user@example.com', password: 'password' });
    expect(response.status).toBe(500);
    expect(response.text).toContain('Error during login');
  });

  it('should return 401 if user is not found', async () => {
    db.query.mockImplementationOnce((sql, params, callback) => callback(null, []));
    const response = await request(app).post('/teacher_login').send({ email: 'nonexistent@example.com', password: 'password' });
    expect(response.status).toBe(401);
    expect(response.text).toContain('Invalid email or password');
  });

  it('should authenticate user with correct credentials', async () => {
    db.query.mockImplementationOnce((sql, params, callback) => callback(null, [{ email: 'user@example.com', password: bcrypt.hashSync('password', 10), name: 'John Doe', image: 'userimg.jpg' }]));
    bcrypt.compare.mockImplementationOnce((pass, hash, callback) => callback(null, true));
    const response = await request(app).post('/teacher_login').send({ email: 'user@example.com', password: 'password' });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/teacher_homepage');
  });
});