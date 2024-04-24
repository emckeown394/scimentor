const request = require('supertest');
const app = require('../app'); // Adjust this to your actual app path
jest.mock('../mock/dbconnection');
const { query } = require('../mock/dbconnection');

jest.mock('express-session', () => {
    return () => (req, res, next) => {
      req.session = { student_id: 123 }; // Mock student ID
      next();
    };
  });

  describe('POST /api/biology_scores', () => {
    beforeEach(() => {
      query.mockClear();
    });
  
    it('should insert a new biology score if none exists', async () => {
      query
        .mockImplementationOnce((sql, params, callback) => callback(null, [])) // No existing score
        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 })); // Insert success
  
      const response = await request(app).post('/api/biology_scores').send({ bio_score: 85 });
  
      expect(response.status).toBe(200);
      expect(response.text).toBe('New biology score added successfully.');
    });
  
    it('should update existing score if the new score is higher', async () => {
      query
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ biology_score: 80 }])) // Existing score
        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 })); // Update success
  
      const response = await request(app).post('/api/biology_scores').send({ bio_score: 90 });
  
      expect(response.status).toBe(200);
      expect(response.text).toBe('Biology score updated successfully.');
    });
  
    it('should not update if the existing score is higher or equal', async () => {
      query.mockImplementationOnce((sql, params, callback) => callback(null, [{ biology_score: 95 }]));
  
      const response = await request(app).post('/api/biology_scores').send({ bio_score: 90 });
  
      expect(response.status).toBe(200);
      expect(response.text).toBe('Existing biology score is higher or equal; not updated.');
    });
  
    it('should handle database errors during score fetching', async () => {
      query.mockImplementationOnce((sql, params, callback) => callback(new Error('Database error'), null));
  
      const response = await request(app).post('/api/biology_scores').send({ bio_score: 85 });
  
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error checking for existing biology score.');
    });
  
    it('should handle errors during score updating', async () => {
      query
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ biology_score: 70 }]))
        .mockImplementationOnce((sql, params, callback) => callback(new Error('Update error'), null));
  
      const response = await request(app).post('/api/biology_scores').send({ bio_score: 85 });
  
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error updating biology score.');
    });
  });