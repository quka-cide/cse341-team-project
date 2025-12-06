const request = require('supertest');
const app = require('../server'); // Assuming your server.js exports the express app
const mongoose = require('mongoose');
const eventsModel = require('../models/events'); // Assuming this path is correct

// Mock event data
const mockEvent = {
    title: 'Test Event 1',
    description: 'A description for testing',
    date: '2026-10-20',
    location: 'Test City',
};

// Global variable to hold the ID of the created test event
let eventId; 

// --- Setup and Teardown ---
beforeAll(async () => {
    // Note: In a real project, you'd connect to a separate test database here
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }
});

beforeEach(async () => {
    // Create a new event for 'GET single' tests
    const createdEvent = await eventsModel.create(mockEvent);
    eventId = createdEvent._id.toString();
});

afterEach(async () => {
    // Clean up data after each test
    await eventsModel.deleteMany({});
});

afterAll(async () => {
    // Disconnect from database after all tests are run
    await mongoose.connection.close();
});

// --- Unit Tests for Events GET Routes ---

describe('GET /api/events', () => {

    test('should return 200 and an array of events', async () => {
        const response = await request(app).get('/api/events');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('title', mockEvent.title);
    });

});

describe('GET /api/events/:id', () => {

    test('should return 200 and a single event by ID', async () => {
        const response = await request(app).get(`/api/events/${eventId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', eventId);
        expect(response.body).toHaveProperty('location', mockEvent.location);
    });

    test('should return 404 for a valid but non-existent ID', async () => {
        const nonExistentId = '60c72b2f9c1d440000000000'; // Example valid but not found ID
        const response = await request(app).get(`/api/events/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Event not found');
    });
    
    test('should return 400 for an invalid ID format (CastError)', async () => {
        const invalidId = 'abc123invalid';
        const response = await request(app).get(`/api/events/${invalidId}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid Event ID format');
    });
});