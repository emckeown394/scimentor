const request = require('supertest');
const app = require('../app'); // Ensure this path points to your Express app
const db = require('../connection'); // Adjust to your actual path
const bcrypt = require('bcrypt');

jest.mock('../connection');
jest.mock('bcrypt');

describe('POST /teachers_signup', () => {
  beforeEach(() => {
    db.query.mockClear();
    bcrypt.hashSync.mockReturnValue('hashed_password');
  });

  it('should fail when the password does not meet requirements', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'short', profileImage: 'url/to/image' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('Password must contain at least 1 lowercase and uppercase letter, 1 number and be at least 8 characters long');
  });

  it('should fail when the email does not include "@"', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ name: 'John Doe', email: 'johnexample.com', password: 'Password1', profileImage: 'url/to/image' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('Your email must include an @ symbol');
  });

  db.query.mockImplementation((sql, params, callback) => {
    if (sql.includes('SELECT COUNT(*) AS count FROM students WHERE email = ?')) {
        return callback(null, [{ count: 1 }]); // Simulates finding an existing email
    }
});

  it('should return error when email already exists', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ name: 'John Doe', email: 'test@gmail.com', password: 'Password1!', profileImage: 'url/to/image' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('This email already exists');
  });

  it('should successfully create a user and redirect to teacher_login', async () => {
    db.query
      .mockImplementationOnce((sql, params, callback) => callback(null, [{ count: 0 }])) // Email does not exist
      .mockImplementationOnce((sql, params, callback) => callback(null)); // Successful insert
    const response = await request(app)
      .post('/teachers_signup')
      .send({ name: 'John Doe', email: 'teachertest@example.com', password: 'Password2!', profileImage: 'url/to/image' });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/teacher_login');
  });
});
