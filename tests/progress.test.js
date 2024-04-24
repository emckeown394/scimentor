const request = require('supertest');
const app = require('../app');
jest.mock('../connection', () => require('../mock/dbconnection'));
const { query } = require('../mock/dbconnection');
jest.mock('../middlewares/isAuthenticated', () => {
    return (req, res, next) => {
        req.session = { student_id: 1, save: jest.fn(() => Promise.resolve()), user: { name: "John Doe" }, touch: jest.fn() };
        next();
    };
});

describe('GET /progress', () => {
  beforeEach(() => {
    connection.query.mockClear();
  });

  it('should render the progress page for an existing user with scores', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(null, [{ biology_score: 12, chemistry_score: 15, physics_score: 19 }]);
    });

    const response = await request(app).get('/progress');

    expect(response.status).toBe(200);
    expect(response.text).toContain('John Doe');
    expect(response.text).toContain('75%'); // Checking if percentage calculation is displayed
    expect(response.text).toContain('progress_img/bio_75.png');
    done(); // Checking if correct image is used
  }, 6000);

  it('should return 500 on database errors', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(new Error('Database query error'), null);
    });

    const response = await request(app).get('/progress');

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error fetching user scores");
  }, 6000);

  it('should handle case where no scores are available', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(null, []); // Simulating no scores found
    });

    const response = await request(app).get('/progress');

    expect(response.status).toBe(200);
    expect(response.text).toContain('No score available');
    expect(response.text).toContain('progress_img/bio_0.png'); // Check that 0% image is used
  }, 6000);
});