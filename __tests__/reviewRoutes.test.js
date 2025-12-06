const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const eventsModel = require('../models/events'); 
const reviewsModel = require('../models/reviews');
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
    const user = await userModel.create({ fullName: 'Review Test User', email: 'revtest@example.com', password: 'hashedpassword' });
    userId = user._id.toString();
    const event = await eventsModel.create({ title: 'Review Event', description: 'Test', date: '2026-01-01', location: 'Test Location', creatorId: userId });
    eventId = event._id.toString();
});

afterAll(async () => {
    // Cleanup all created records and disconnect
    await reviewsModel.deleteMany({});
    await eventsModel.deleteMany({});
    await userModel.deleteMany({});
    await mongoose.connection.close();
});

// --- Unit Tests for Reviews GET Route ---
describe('GET /api/reviews/:eventId', () => {

    // Test Case 1: Successfully fetch reviews
    test('should return 200 and an array of reviews for a given eventId', async () => {
        // Create a review linked to the test event
        const mockReview = { eventId: eventId, userId: userId, rating: 5, comment: 'Great event!' };
        await reviewsModel.create(mockReview);

        const response = await request(app).get(`/api/reviews/${eventId}`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('comment', mockReview.comment);
        expect(response.body[0]).toHaveProperty('rating', mockReview.rating);
    });

    // Test Case 2: Event exists but has no reviews
    test('should return 404 when no reviews are found for the eventId', async () => {
        // Clear any existing reviews for this event
        await reviewsModel.deleteMany({ eventId: eventId });
        
        const response = await request(app).get(`/api/reviews/${eventId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'No reviews found for this event');
    });

    // Test Case 3: Invalid Event ID format
    test('should return 500 when eventId format is invalid', async () => {
        const invalidId = 'invalid-mongo-id';
        const response = await request(app).get(`/api/reviews/${invalidId}`);

        // Mongoose CastError usually defaults to 500 if not explicitly caught
        expect(response.statusCode).toBe(500); 
    });
});