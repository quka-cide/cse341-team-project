const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const eventsModel = require('../models/events'); // Assuming model paths
const registrationModel = require('../models/registeration'); 
const userModel = require('../models/user');

let eventId;
let userId;

// --- Setup and Teardown ---
beforeAll(async () => {
    // Connect to test DB
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }
    
    // Create necessary foreign key records
    const user = await userModel.create({ fullName: 'Reg Test User', email: 'regtest@example.com', password: 'hashedpassword' });
    userId = user._id.toString();
    const event = await eventsModel.create({ title: 'Reg Event', description: 'Test', date: '2026-01-01', location: 'Test Location', creatorId: userId });
    eventId = event._id.toString();
});

afterAll(async () => {
    // Cleanup all created records and disconnect
    await registrationModel.deleteMany({});
    await eventsModel.deleteMany({});
    await userModel.deleteMany({});
    await mongoose.connection.close();
});

// --- Unit Tests for Registrations GET Route ---
describe('GET /api/registrations/:eventId', () => {
    
    // Test Case 1: Successfully fetch registrations
    test('should return 200 and an array of registrations for a given eventId', async () => {
        // Create a registration linked to the test event
        await registrationModel.create({ eventId: eventId, userId: userId });

        const response = await request(app).get(`/api/registrations/${eventId}`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('eventId', eventId);
    });

    // Test Case 2: Event exists but has no registrations
    test('should return 404 when no registrations are found for the eventId', async () => {
        // First, clear any existing registrations for this event
        await registrationModel.deleteMany({ eventId: eventId });
        
        const response = await request(app).get(`/api/registrations/${eventId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'No registrations found for this event');
    });
    
    // Test Case 3: Invalid Event ID format
    test('should return 400 when eventId format is invalid', async () => {
        const invalidId = 'not-a-mongo-id';
        const response = await request(app).get(`/api/registrations/${invalidId}`);

        // This assumes your controller returns a 500 or 400 for a CastError
        // If 500 is returned (default Mongoose error), the test should reflect that
        expect(response.statusCode).toBe(500); // Mongoose CastError usually defaults to 500 if not explicitly caught
    });
});