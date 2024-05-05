const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// Mock database function and authentication middleware
const queryAsync = jest.fn();
jest.mock('../connection', () => ({
  queryAsync: jest.fn().mockImplementation(() => Promise.resolve([{ id: 1, name: 'John Doe', score: 90 }]))
}));

const isAuthenticated = jest.fn((req, res, next) => {
  req.session = { student_id: 1 };
  next();
});

const app = express();
app.use(bodyParser.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use(isAuthenticated);


app.get("/progress_report/:studentId", async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const userDetailsResult = await queryAsync('SELECT name FROM students WHERE id = ?', [studentId]);
      res.json(userDetailsResult[0]);
    } catch (error) {
      res.status(500).send('Server error');
    }
});

app.get("/progress_report/:studentId", require('../app'));

// Mock implementation for rendering views
app.response.render = jest.fn();

describe('GET /progress_report/:studentId', () => {
  beforeEach(() => {
    queryAsync.mockReset();
    app.response.render.mockReset();
  });

  it('should fetch and display progress report for an authenticated user', async () => {
    queryAsync.mockResolvedValueOnce([{ name: 'John Doe', email: 'john@example.com', image: 'profile.jpg' }])
              .mockResolvedValueOnce([{ biology_score: 12, chemistry_score: 15, physics_score: 15 }])
              .mockResolvedValueOnce([{ content: 'Excellent progress', teacherName: 'Mr. Smith' }]);

    const response = await request(app)
      .get('/progress_report/1')
      .expect('Content-Type', /html/);

    expect(queryAsync).toHaveBeenCalledTimes(3); // Ensure all necessary queries were made
    expect(app.response.render).toHaveBeenCalledWith("progress_report", expect.any(Object));
    expect(response.status).toBe(200);
  });

  it('should handle no user found scenario', async () => {
    queryAsync.mockResolvedValueOnce([]); // Simulate no user found

    const response = await request(app)
      .get('/progress_report/1')
      .expect('Content-Type', /html/);

    expect(response.status).toBe(302); // Redirect to login
    expect(response.headers.location).toBe('/login');
  });

  it('should handle database errors', async () => {
    queryAsync.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/progress_report/1');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Server error');
  });
});