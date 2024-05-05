const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

jest.mock('../connection');

// Route setup
app.get("/teacher_topics", (req, res) => {
  let readsql = "SELECT id, name, subject_type, image FROM topics";
  connection.query(readsql, (err, rows) => {
    try {
      if (err) throw err;
      let topicData = rows;
      let loggedIn = req.session.loggedin;
      res.render('teacher_topics', { title: 'Teacher Topics', topicData, loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to load topics page');
    }
  });
});

// Mock express render method
describe('GET /teacher_topics', () => {
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
  
      const response = await request(app).get('/teacher_topics').set('Cookie', ['loggedin=true']);
  
      expect(response.status).toBe(200);
      expect(response.text).toContain('Topics');
      expect(response.text).toContain('Biology');
      expect(response.text).toContain('Chemistry');
    });
  
    it('should handle database errors gracefully', async () => {
      connection.query.mockImplementation((sql, callback) => callback(new Error('Database failure'), null));
  
      const response = await request(app).get('/teacher_topics').set('Cookie', ['loggedin=true']);
  
      expect(response.status).toBe(500);
      expect(response.text).toBe('Failed to load topics page');
    });
});