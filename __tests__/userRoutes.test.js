const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const userModel = require('../models/user'); 

// Mock user data (Note: Password is required for the model, but we won't test login here)
const mockUser1 = {
    fullName: 'Test User 1',
    email: 'test1@example.com',
    password: 'password123',
};

// --- Setup and Teardown ---
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }
});

beforeEach(async () => {
    await userModel.create(mockUser1);
});

afterEach(async () => {
    await userModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

// --- Unit Tests for Users GET Route ---

describe('GET /api/users', () => {

    test('should return 200 and an array of users', async () => {
        const response = await request(app).get('/api/users');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('email', mockUser1.email);
        // Ensure sensitive data like password hash is NOT returned
        expect(response.body[0]).not.toHaveProperty('password'); 
    });
});