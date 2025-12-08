const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const reviewsModel = require("../models/reviews");

// Mock the reviews model
jest.mock("../models/reviews");

describe("Reviews GET Endpoints", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reviews/:eventId", () => {
    // Test 1: should return all reviews for an event
    it("should return all reviews for an event with status 200", async () => {
      const mockReviews = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: "event123",
          userId: "user456",
          rating: 5,
          comment: "Great event!",
          date: "2025-01-10",
        },
        {
          _id: "507f1f77bcf86cd799439012",
          eventId: "event123",
          userId: "user789",
          rating: 4,
          comment: "Good experience",
          date: "2025-01-11",
        },
      ];

      reviewsModel.find.mockResolvedValue(mockReviews);

      const response = await request(app).get("/api/reviews/event123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReviews);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    // Test 2: should return 404 when no reviews found for event
    it("should return 404 when no reviews found for event", async () => {
      reviewsModel.find.mockResolvedValue([]);

      const response = await request(app).get("/api/reviews/nonexistent-event");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No reviews found for this event");
    });

    // Test 3: should handle database errors
    it("should return 500 when database error occurs", async () => {
      reviewsModel.find.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app).get("/api/reviews/event123");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching reviews");
    });

    // Test 4: should filter reviews by eventId correctly
    it("should filter reviews by eventId correctly", async () => {
      const eventId = "specific-event-id";
      const mockReviews = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: eventId,
          userId: "user123",
          rating: 5,
          comment: "Amazing!",
          date: "2025-01-10",
        },
      ];

      reviewsModel.find.mockResolvedValue(mockReviews);

      const response = await request(app).get(`/api/reviews/${eventId}`);

      expect(response.status).toBe(200);
      expect(reviewsModel.find).toHaveBeenCalledWith({ eventId: eventId });
      expect(response.body[0].eventId).toBe(eventId);
    });

    // Test 5: should return reviews with correct rating values
    it("should return reviews with valid rating values (1-5)", async () => {
      const mockReviews = [
        {
          _id: "1",
          eventId: "event1",
          userId: "user1",
          rating: 1,
          comment: "Poor",
        },
        {
          _id: "2",
          eventId: "event1",
          userId: "user2",
          rating: 3,
          comment: "Average",
        },
        {
          _id: "3",
          eventId: "event1",
          userId: "user3",
          rating: 5,
          comment: "Excellent",
        },
      ];

      reviewsModel.find.mockResolvedValue(mockReviews);

      const response = await request(app).get("/api/reviews/event1");

      expect(response.status).toBe(200);
      response.body.forEach((review) => {
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
      });
    });

    // Test 6: should return single review when only one exists
    it("should return single review when only one exists for event", async () => {
      const mockReview = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: "event-single",
          userId: "single-user",
          rating: 4,
          comment: "Nice event",
          date: "2025-01-15",
        },
      ];

      reviewsModel.find.mockResolvedValue(mockReview);

      const response = await request(app).get("/api/reviews/event-single");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].rating).toBe(4);
    });
  });
});
