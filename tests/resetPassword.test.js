const request = require('supertest');
const app = require('../app'); // Adjust this path to your Express app
const db = require('../connection');
const bcrypt = require('bcrypt');
jest.mock('bcrypt');
jest.mock('../connection', () => ({
    query: jest.fn()
}));

describe('POST /reset_password', () => {
    beforeEach(() => {
        db.query.mockClear();
        bcrypt.hashSync.mockReset();
        bcrypt.hashSync.mockReturnValue('hashed_password');
    });

    it('should return 400 if email or newPassword is missing', async () => {
        const app = require('../app'); // Make sure this import comes after jest.mock
        const request = require('supertest');

        const response = await request(app)
            .post('/reset_password')
            .send({ email: '', newPassword: '' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Email and new password are required.');
    });

    it('should return 404 if the email does not exist', async () => {
        db.query.mockResolvedValue({ affectedRows: 0 });
        const response = await request(app)
            .post('/reset_password')
            .send({ email: 'nonexistent@example.com', newPassword: 'newPassword123' });
        expect(response.status).toBe(404);
        expect(response.text).toBe('Email not found.');
    });

    it('should redirect to login on successful password reset', async () => {
        db.query.mockResolvedValue({ affectedRows: 1 });
        const response = await request(app)
            .post('/reset_password')
            .send({ email: 'exist@example.com', newPassword: 'newPassword123' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });

    it('should return 500 if there is a database error', async () => {
        db.query.mockRejectedValue(new Error('Database error'));
        const response = await request(app)
            .post('/reset_password')
            .send({ email: 'test@example.com', newPassword: 'newPassword123' });
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error resetting password.');
    });
});