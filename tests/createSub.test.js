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
app.post('/create_subject', (req, res) => {
    const { sub_name, sub_img } = req.body;
    db.query(
      `INSERT INTO subjects (name, image) VALUES (?, ?)`,
      [sub_name, sub_img],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('An error occurred during subject creation.');
        }
        res.redirect('/teacher_homepage');
      }
    );
  });

describe('POST /create_subject', () => {
    beforeAll(() => {
      db.query.mockImplementation((sql, params, callback) => {
        if (params.includes('Error')) {
          callback(new Error('Fake DB error'));
        } else {
          callback(null);
        }
      });
    });
  
    it('should create a subject successfully', async () => {
      const response = await request(app)
        .post('/create_subject')
        .send({ 'sub-name': 'Biology', 'sub-img': 'path/to/biology.jpg' });
  
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/teacher_homepage');
    });
  
    it('should handle database errors', async () => {
        // Setup the mock to simulate a database error
        db.query.mockImplementation((sql, params, callback) => {
          callback(new Error('Fake DB error'), null);
        });
      
        const response = await request(app)
          .post('/create_subject')
          .send({ 'sub-name': 'Biology', 'sub-img': 'biology.png' });
      
        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred during subject creation.');
    });
});