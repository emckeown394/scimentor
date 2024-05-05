const db = require('../connection');
jest.mock('../connection', () => ({
  query: jest.fn()
}));

// Mock the authentication middleware
const isTAuthenticated = jest.fn((req, res, next) => {
    req.session = { teacher_id: 1 };
    next();
});

const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(isTAuthenticated);

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

describe('POST /api/reports/:studentId', () => {
    beforeEach(() => {
      db.query.mockClear();
    });
  
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/reports/1')
        .send({ specialEdNeed: 'Special need info', content: '' });
  
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required report fields.');
    });
  
    it('should create a report successfully', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, { insertId: 1 }));
      const res = await request(app)
        .post('/api/reports/1')
        .send({ specialEdNeed: 'Special need info', content: 'Report content' });
  
      expect(res.status).toBe(302);
      expect(db.query).toHaveBeenCalled();
      expect(res.headers.location).toBe('/students');
    });
  
    it('should handle database errors during report creation', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Database error'), null));
      const res = await request(app)
        .post('/api/reports/1')
        .send({ specialEdNeed: 'Special need info', content: 'Report content' });
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Failed to create report.');
    });
});