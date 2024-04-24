const request = require('supertest');
const app = require('../app');
const { queryAsync } = require('../connection');

jest.mock('../connection', () => require('../mock/dbconnection'));
const { query } = require('../mock/dbconnection');

// Mock isAuthenticated middleware
jest.mock('../middlewares/isAuthenticated', () => {
    return (req, res, next) => {
        req.session = {
            student_id: 1, 
            user: { name: "John Doe" },
            loggedin: true,
            touch: jest.fn()
        };
        next();
    };
});

module.exports = {
    testTimeout: 10000
  };

describe('GET /profile', () => {
  beforeEach(() => {
    queryAsync.mockClear();
  });

  // Simulating user not found
  queryAsync.mockResolvedValueOnce([]); // For user details query

  it('should render the profile page for an existing user', async () => {
    const next = jest.fn();
    queryAsync.mockResolvedValueOnce([{ name: 'Test', email: 'test@gmail.com', image: 'm' }])
              .mockResolvedValueOnce([{ id: 1, name: 'Biology', image: 'bio.jpg' }])
              .mockResolvedValueOnce([{ subject_id: 1, biology_score: 15 }]);

    const response = await request(app).get('/profile');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Test'); // Check that user details appear in the response
    expect(response.text).toContain('Biology'); // Check that subjects appear in the response
  });

  it('should redirect to login if no user is found', async () => {
    queryAsync.mockResolvedValueOnce([]); // No user details found

    const response = await request(app).get('/profile');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  it('should handle errors during database queries', async () => {
    queryAsync.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/profile');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error loading profile');
  });
});