const request = require('supertest');
const app = require('../app'); // Adjust this path to point to your Express app
const db = require('../connection'); // Ensure you mock this path correctly
const bcrypt = require('bcrypt');
const session = require('supertest-session');

let testSession = null;

jest.mock('../connection');
jest.mock('bcrypt');

describe('POST /login', () => {
  beforeEach(() => {
    db.query.mockClear();
    bcrypt.compare.mockClear();
    testSession = session(app);
  });

  it('should respond with 400 if email or password is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: '', password: '' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Enter Email and Password');
  });

  it('should handle database errors gracefully', async () => {
    db.query.mockImplementation((sql, params, callback) => callback(new Error('Database error'), null));
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error during login');
  });

  it('should handle bcrypt errors gracefully', async () => {
    db.query.mockImplementation((sql, params, callback) => callback(null, [{ email: 'test@example.com', password: 'hashed_password' }]));
    bcrypt.compare.mockImplementation((password, hash, callback) => callback(new Error('Bcrypt error'), null));
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error during login');
  });

  it('should respond with 401 for incorrect password', async () => {
    db.query.mockImplementation((sql, params, callback) => callback(null, [{ email: 'test@example.com', password: 'hashed_password' }]));
    bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, false));
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.text).toContain('Invalid email or password');
  });

  const agent = request.agent(app); //maintains cookies and session data

  it('should redirect to homepage for successful login', async () => {
    db.query.mockImplementation((sql, params, callback) => callback(null, [{ id: 1, email: 'test@example.com', password: 'hashed_password', name: 'Test User', image: 'path_to_image' }]));
    bcrypt.compare.mockImplementation((password, hash, callback) => callback(null, true));
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/homepage');
  });
});