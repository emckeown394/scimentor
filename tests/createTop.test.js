const db = require('../connection');
jest.mock('../connection', () => ({
  query: jest.fn()
}));

const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.post('/create_topic', (req, res) => {
    const { top_name, sub_name, top_img } = req.body;
  
    // First, fetch the subject ID based on the subject name
    db.query(
      `SELECT id FROM subjects WHERE name = ? LIMIT 1`,
      [sub_name],
      (subErr, subResults) => {
        if (subErr || subResults.length === 0) {
          console.error(subErr || 'Subject not found');
          return res.status(500).send('An error occurred during topic creation: Subject not found.');
        }
  
        const subjectId = subResults[0].id;
  
        db.query(
          `INSERT INTO topics (name, subject_id, subject_type, image) VALUES (?, ?, ?, ?)`,
          [top_name, subjectId, sub_name, top_img],
          (topicErr) => {
            if (topicErr) {
              console.error(topicErr);
              res.status(500).send('An error occurred during topic creation.');
            } else {
              res.redirect('/teacher_topics');
            }
          }
        );
      }
    );
  });

describe('POST /create_topic', () => {
    beforeAll(() => {
      db.query.mockImplementation((sql, params, callback) => {
        if (params.includes('Error')) {
          callback(new Error('Fake DB error'));
        } else {
          callback(null);
        }
      });
    });
  
    it('should create a topic successfully', async () => {
        // Setup mock for SELECT query
        db.query.mockImplementationOnce((sql, params, callback) => {
          if (sql.includes('SELECT id FROM subjects')) {
            callback(null, [{ id: 1 }]); // Simulate finding a subject
          }
        });
      
        // Setup mock for INSERT query
        db.query.mockImplementationOnce((sql, params, callback) => {
          if (sql.includes('INSERT INTO topics')) {
            callback(null, { affectedRows: 1 }); // Simulate successful insert
          }
        });
      
        const response = await request(app)
          .post('/create_topic')
          .send({ 'top-name': 'Cell Structure', 'sub-name': 'Biology', 'top-img': 'cell.png' });
      
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/teacher_topics');
    });
  
    it('should return an error if the subject is not found', async () => {
        db.query.mockImplementationOnce((sql, params, callback) => {
          if (sql.includes('SELECT id FROM subjects')) {
            callback(null, []); // Simulate no subject found
          }
        });
      
        const response = await request(app)
          .post('/create_topic')
          .send({ 'top-name': 'Cell Structure', 'sub-name': 'Unknown', 'top-img': 'cell.png' });
      
        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred during topic creation: Subject not found.');
    });

    it('should handle database errors during topic creation', async () => {
        // Mock the SELECT query normally
        db.query.mockImplementationOnce((sql, params, callback) => {
          if (sql.includes('SELECT id FROM subjects')) {
            callback(null, [{ id: 1 }]);
          }
        });
      
        // Simulate a database error on INSERT
        db.query.mockImplementationOnce((sql, params, callback) => {
          if (sql.includes('INSERT INTO topics')) {
            callback(new Error('DB Error'), null);
          }
        });
      
        const response = await request(app)
          .post('/create_topic')
          .send({ 'top-name': 'Cell Structure', 'sub-name': 'Biology', 'top-img': 'cell.png' });
      
        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred during topic creation.');
    });
});