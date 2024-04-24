jest.mock('../connection', () => ({
    query: jest.fn()
  }));
  const { query } = require('../connection');

  const request = require('supertest');
const app = require('../app'); // Adjust this to the correct path of your Express app

describe('GET /topics/1', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    query.mockClear();
  });

  it('should render the topic data successfully', async () => {
    // Setup mock to return expected topic data
    query.mockImplementation((sql, callback) => callback(null, [{ id: 1, name: 'Animal and Plant Cells', subject_type: 'Biology', image: 'cell.jpg' }]));

    const response = await request(app).get('/topics/1');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Animal and Plant Cells');
  });

  it('should handle database errors', async () => {
    // Setup mock to simulate a database error
    query.mockImplementation((sql, callback) => callback(new Error('Database error'), null));

    const response = await request(app).get('/topics/1');

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Failed to load topics page');
  });
});