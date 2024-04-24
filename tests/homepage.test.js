const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

jest.mock('../connection');

describe('GET /homepage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    connection.query.mockClear();
  });

  it('should load the homepage successfully with data', async () => {
    const fakeData = [{ id: 1, name: 'Biology', image: 'biology.jpg' }];
    connection.query.mockImplementation((sql, callback) => callback(null, fakeData));

    const response = await request(app).get('/homepage').set('Cookie', ['loggedin=true']);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Student Homepage');
    expect(response.text).toContain('Biology');
  });

  it('should handle database errors gracefully', async () => {
    connection.query.mockImplementation((sql, callback) => callback(new Error('Database failure'), null));

    const response = await request(app).get('/homepage').set('Cookie', ['loggedin=true']);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Failed to load student homepage');
  });
});