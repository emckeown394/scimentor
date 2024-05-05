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
app.get("/all_reports", isTAuthenticated, async (req, res) => {
    const teacherId = req.session.teacher_id;
  
    try {
        const query = `
        SELECT reports.id, students.name AS studentName, students.image, reports.content, reports.created_at 
        FROM reports 
        JOIN students ON reports.studentId = students.id 
        WHERE reports.teacherId = ?
        ORDER By reports.created_at DESC`;
        db.query(query, [teacherId], (err, reports) => {
          if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).send('Error fetching reports');
          }
          //formatting date and time in UK format
          reports = reports.map(report => {
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
            const datePart = new Date(report.created_at).toLocaleDateString('en-GB', dateOptions);
            const timePart = new Date(report.created_at).toLocaleTimeString('en-GB', timeOptions);
            report.created_at = `${datePart} ${timePart}`;
            return report;
          });
          res.render('all_reports', { reports: reports });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load the reports page');
    }
});

it('should fetch all reports successfully', async () => {
    // Setup DB mock to return sample reports
    db.query.mockImplementation((sql, params, callback) => {
      const reports = [{
        id: 1,
        studentName: 'John Doe',
        image: 'path/to/image.jpg',
        content: 'Report Content',
        created_at: new Date('2020-01-01T12:00:00Z')
      }];
      callback(null, reports);
    });
  
    const request = require('supertest');
    const response = await request(app)
      .get('/all_reports');
  
    expect(response.status).toBe(200);
    expect(response.body.reports).toHaveLength(1);
    expect(response.body.reports[0].studentName).toBe('John Doe');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
});

it('should handle errors when fetching reports', async () => {
    db.query.mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });
  
    const request = require('supertest');
    const response = await request(app)
      .get('/all_reports');
  
    expect(response.status).toBe(500);
    expect(response.text).toContain('Error fetching reports');
});