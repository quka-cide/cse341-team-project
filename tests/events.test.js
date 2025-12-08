const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const eventsModel = require("../models/events");

// Mock the events model
jest.mock("../models/events");

describe("Events GET Endpoints", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: GET /api/events - should return all events
  describe("GET /api/events", () => {
    it("should return all events with status 200", async () => {
      const mockEvents = [
        {
          _id: "507f1f77bcf86cd799439011",
          title: "Tech Conference",
          description: "Annual tech meetup",
          date: "2025-01-15",
          location: "New York",
        },
        {
          _id: "507f1f77bcf86cd799439012",
          title: "Music Festival",
          description: "Summer music event",
          date: "2025-06-20",
          location: "Los Angeles",
        },
      ];

      eventsModel.find.mockResolvedValue(mockEvents);

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    // Test 2: GET /api/events - should return empty array when no events exist
    it("should return empty array when no events exist", async () => {
      eventsModel.find.mockResolvedValue([]);

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Test 3: GET /api/events - should handle database errors
    it("should return 500 when database error occurs", async () => {
      eventsModel.find.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching events");
    });
  });

  // Test 4: GET /api/events/:id - should return single event by ID
  describe("GET /api/events/:id", () => {
    it("should return a single event by ID with status 200", async () => {
      const mockEvent = {
        _id: "507f1f77bcf86cd799439011",
        title: "Tech Conference",
        description: "Annual tech meetup",
        date: "2025-01-15",
        location: "New York",
      };

      eventsModel.findById.mockResolvedValue(mockEvent);

      const response = await request(app).get(
        "/api/events/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(response.body.title).toBe("Tech Conference");
    });

    // Test 5: GET /api/events/:id - should return 404 when event not found
    it("should return 404 when event is not found", async () => {
      eventsModel.findById.mockResolvedValue(null);

      const response = await request(app).get(
        "/api/events/507f1f77bcf86cd799439099"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    // Test 6: GET /api/events/:id - should return 400 for invalid ID format
    it("should return 400 for invalid ID format", async () => {
      const error = new Error("Cast to ObjectId failed");
      error.kind = "ObjectId";
      eventsModel.findById.mockRejectedValue(error);

      const response = await request(app).get("/api/events/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid Event ID format");
    });
  });
});
