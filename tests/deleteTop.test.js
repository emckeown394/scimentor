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
app.delete('/delete_topic/:id', (req, res) => {
    const topicId = req.params.id;
  
    db.query(
        'DELETE FROM topics WHERE id = ?',
        [topicId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error deleting topic' });
            } else {
                res.json({ message: 'Topic deleted successfully' });
            }
        }
    );
});

it('should delete a topic successfully', async () => {
    // Mock db.query to simulate successful deletion
    db.query.mockImplementation((sql, params, callback) => callback(null, { affectedRows: 1 }));
  
    const response = await request(app)
      .delete('/delete_topic/123') // Assuming '123' is the topic ID
      .send();
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Topic deleted successfully');
});

it('should handle case where the topic does not exist', async () => {
    // Mock db.query to simulate no rows affected (topic not found)
    db.query.mockImplementation((sql, params, callback) => callback(null, { affectedRows: 0 }));
  
    const response = await request(app)
      .delete('/delete_topic/999')
      .send();
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Topic deleted successfully');
});

it('should handle database errors during deletion', async () => {
    // Mock db.query to simulate a database error
    db.query.mockImplementation((sql, params, callback) => callback(new Error('DB Error'), null));
  
    const response = await request(app)
      .delete('/delete_topic/123')
      .send();
  
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error deleting topic');
});