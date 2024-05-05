const db = require('../connection');
jest.mock('../connection', () => ({
  query: jest.fn()
}));

// Mock the authentication middleware
const isAuthenticated = jest.fn((req, res, next) => {
    if (req.session && req.session.student_id) {
        next();
    } else {
        res.redirect('/login');
    }
});

const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.session = { student_id: "1" }; // Simulate an authenticated session
    next();
});
app.use(isAuthenticated);

const mockQuery = jest.fn();
db.query = mockQuery;

// Set up a simple mock view engine
app.engine('html', (path, options, callback) => {
    callback(null, 'rendered content');
});
app.set('views', './views');
app.set('view engine', 'html');

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
app.get("/quiz/:subject", isAuthenticated, async (req,res) => {
    const studentId = req.session.student_id;
    const subject = req.params.subject;
    const subjectId = req.params.subjectId;
    res.render('quiz', { studentId: studentId, subject: subject, subjectId: subjectId });
});

app.response.render = function(view, options) {
    this.type('json').send({ view, options });
};

describe('GET /quiz/:subject', () => {
    it('should display the quiz page for an authenticated user', async () => {
        const response = await request(app)
          .get('/quiz/biology');
  
        expect(response.status).toBe(200);
        expect(response.body.options).toHaveProperty('studentId', '1');
        expect(response.body.options).toHaveProperty('subject', 'biology');
    });
});