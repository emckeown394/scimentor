const request = require('supertest');
const app = require('../app');
jest.mock('../connection', () => require('../mock/dbconnection'));
const db = require('../connection');
const { queryAsync } = require('../mock/dbconnection');
jest.mock('../middlewares/isAuthenticated', () => {
  return (req, res, next) => { req.session = { user: { id: 1 } }; next(); };
});

describe('GET /progress_report/:studentId', () => {
    beforeEach(() => {
      queryAsync.mockClear();
    });

    it('should render the progress report for an existing student', async () => {
        queryAsync
        .mockResolvedValueOnce([{ name: 'John Doe', email: 'john@example.com', image: 'profile.jpg' }])
        .mockResolvedValueOnce([{ biology_score: 12, chemistry_score: 18, physics_score: 15 }])
        .mockResolvedValueOnce([{ reportId: 1, content: 'Good job!', teacherName: 'Ms. Smith' }]);
        
        const response = await request(app).get('/progress_report/1');
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('John Doe');
        expect(response.text).toContain('Good job!');
        expect(response.text).toContain('Ms. Smith');
        expect(queryAsync).toHaveBeenCalledTimes(3);
    }, 30000);

  it('should redirect to login if no student is found', async () => {
    queryAsync.mockResolvedValueOnce([]);

    const response = await request(app).get('/progress_report/1');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  }, 30000);

  it('should handle database errors', async () => {
    queryAsync.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/progress_report/1');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Server error');
  }, 30000);
  
});