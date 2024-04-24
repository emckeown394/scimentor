const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

jest.mock('../connection');

describe('GET /topic/2', () => {
  beforeEach(() => {
    connection.query.mockClear();
  });

  it('should load the chemistry topics page successfully for users', async () => {
    const fakeTopics = [
      { id: 1, name: 'Materials', subject_type: 'Chemistry', image: 'materials.jpg' }
    ];
    connection.query.mockImplementation((sql, callback) => callback(null, fakeTopics));

    const response = await request(app).get('/topic/2')
      .set('Cookie', ['loggedin=true; userType=student']);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Chemistry Topics');
    expect(response.text).toContain('Materials');
  });

  it('should handle database errors gracefully', async () => {
    connection.query.mockImplementation((sql, callback) => callback(new Error('Database failure'), null));

    const response = await request(app).get('/topic/2')
      .set('Cookie', ['loggedin=true; userType=student']);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Failed to load chemistry topics page');
  });
});