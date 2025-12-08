const request = require("supertest");
const mongoose = require("mongoose");
const { app, connectDB } = require("../server");
const userModel = require("../models/user");

// Mock the user model
jest.mock("../models/user");

describe("Users GET Endpoints", () => {
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    // Clean up
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // Test 1: GET /api/users - should return all users
  describe("GET /api/users", () => {
    it("should return all users with status 200", async () => {
      const mockUsers = [
        {
          _id: "507f1f77bcf86cd799439011",
          fullName: "John Doe",
          email: "john@example.com",
        },
        {
          _id: "507f1f77bcf86cd799439012",
          fullName: "Jane Smith",
          email: "jane@example.com",
        },
      ];

      userModel.find.mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    // Test 2: GET /api/users - should return empty array when no users exist
    it("should return empty array when no users exist", async () => {
      userModel.find.mockResolvedValue([]);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Test 3: GET /api/users - should handle database errors
    it("should return 500 when database error occurs", async () => {
      userModel.find.mockRejectedValue(new Error("Database connection failed"));

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error fetching users");
    });
  });

  // Test 4: GET /api/users/:id - should return single user by ID
  describe("GET /api/users/:id", () => {
    it("should return a single user by ID with status 200", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        fullName: "John Doe",
        email: "john@example.com",
      };

      userModel.findById.mockResolvedValue(mockUser);

      const response = await request(app).get(
        "/api/users/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(response.body.fullName).toBe("John Doe");
    });

    // Test 5: GET /api/users/:id - should return 404 when user not found
    it("should return 404 when user is not found", async () => {
      userModel.findById.mockResolvedValue(null);

      const response = await request(app).get(
        "/api/users/507f1f77bcf86cd799439099"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    // Test 6: GET /api/users/:id - should return 400 for invalid ID format
    it("should return 400 for invalid ID format", async () => {
      const error = new Error("Cast to ObjectId failed");
      error.kind = "ObjectId";
      userModel.findById.mockRejectedValue(error);

      const response = await request(app).get("/api/users/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid User ID format");
    });
  });
});
