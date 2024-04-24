const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

jest.mock('../connection');

describe('GET /topics', () => {
  beforeEach(() => {
    // Reset all mocks
    connection.query.mockClear();
  });

  it('should load the topics page successfully with data', async () => {
    const fakeTopics = [
      { id: 1, name: 'Biology', subject_type: 'Science', image: 'bio.jpg' },
      { id: 2, name: 'Chemistry', subject_type: 'Science', image: 'chem.jpg' }
    ];
    connection.query.mockImplementation((sql, callback) => callback(null, fakeTopics));

    const response = await request(app).get('/topics').set('Cookie', ['loggedin=true']);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Topics');
    expect(response.text).toContain('Biology');
    expect(response.text).toContain('Chemistry');
  });

  it('should handle database errors gracefully', async () => {
    connection.query.mockImplementation((sql, callback) => callback(new Error('Database failure'), null));

    const response = await request(app).get('/topics').set('Cookie', ['loggedin=true']);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Failed to load topics page');
  });
});