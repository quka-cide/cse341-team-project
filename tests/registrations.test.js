const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const registrationModel = require("../models/registeration");

// Mock the registration model
jest.mock("../models/registeration");

describe("Registrations GET Endpoints", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/registrations/:eventId", () => {
    // Test 1: should return all registrations for an event
    it("should return all registrations for an event with status 200", async () => {
      const mockRegistrations = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: "event123",
          userId: "user456",
          registrationDate: "2025-01-10",
        },
        {
          _id: "507f1f77bcf86cd799439012",
          eventId: "event123",
          userId: "user789",
          registrationDate: "2025-01-11",
        },
      ];

      registrationModel.find.mockResolvedValue(mockRegistrations);

      const response = await request(app).get("/api/registrations/event123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRegistrations);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    // Test 2: should return 404 when no registrations found for event
    it("should return 404 when no registrations found for event", async () => {
      registrationModel.find.mockResolvedValue([]);

      const response = await request(app).get(
        "/api/registrations/nonexistent-event"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "No registrations found for this event"
      );
    });

    // Test 3: should handle database errors
    it("should return 500 when database error occurs", async () => {
      registrationModel.find.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app).get("/api/registrations/event123");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching registrations");
    });

    // Test 4: should return registrations with correct event ID filter
    it("should filter registrations by eventId correctly", async () => {
      const eventId = "specific-event-id";
      const mockRegistrations = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: eventId,
          userId: "user123",
          registrationDate: "2025-01-10",
        },
      ];

      registrationModel.find.mockResolvedValue(mockRegistrations);

      const response = await request(app).get(`/api/registrations/${eventId}`);

      expect(response.status).toBe(200);
      expect(registrationModel.find).toHaveBeenCalledWith({ eventId: eventId });
      expect(response.body[0].eventId).toBe(eventId);
    });

    // Test 5: should return single registration when only one exists
    it("should return single registration when only one exists for event", async () => {
      const mockRegistration = [
        {
          _id: "507f1f77bcf86cd799439011",
          eventId: "event-single",
          userId: "single-user",
          registrationDate: "2025-01-15",
        },
      ];

      registrationModel.find.mockResolvedValue(mockRegistration);

      const response = await request(app).get(
        "/api/registrations/event-single"
      );

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].userId).toBe("single-user");
    });
  });
});
