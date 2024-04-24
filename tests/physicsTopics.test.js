const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

jest.mock('../connection');

describe('GET /topic/6', () => {
  beforeEach(() => {
    connection.query.mockClear();
  });

  it('should load the physics topics page successfully for users', async () => {
    const fakeTopics = [
      { id: 1, name: 'Earth', subject_type: 'Physics', image: 'earth.jpg' }
    ];
    connection.query.mockImplementation((sql, callback) => callback(null, fakeTopics));

    const response = await request(app).get('/topic/6')
      .set('Cookie', ['loggedin=true; userType=student']);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Physics Topics');
    expect(response.text).toContain('Earth');
  });

  it('should handle database errors gracefully', async () => {
    connection.query.mockImplementation((sql, callback) => callback(new Error('Database failure'), null));

    const response = await request(app).get('/topic/6')
      .set('Cookie', ['loggedin=true; userType=student']);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Failed to load physics topics page');
  });
});