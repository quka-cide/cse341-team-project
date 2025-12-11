const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management Platform API",
      version: "1.0.0",
      description:
        "The API for managing Events, Registrations, and Reviews for a team project.",
      contact: {
        name: "Team Quka-Cide",
        url: "https://github.com/quka-cide/cse341-team-project",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Local Development Server",
      },
      {
        url: "https://cse341-team-project-kx4l.onrender.com/api",
        description: "Production Server (Render)",
      },
    ],
    components: {
      securitySchemes: {
        googleAuth: {
          type: "oauth2",
          description: "Google OAuth 2.0 Authentication",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
              tokenUrl: "https://oauth2.googleapis.com/token",
              scopes: {
                profile: "Access to user profile information",
                email: "Access to user email address",
              },
            },
          },
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Event: {
          type: "object",
          required: ["title", "description", "date", "location", "creatorId"],
          properties: {
            _id: { type: "string", description: "MongoDB document ID" },
            title: { type: "string", example: "Tech Conference 2025" },
            description: {
              type: "string",
              example:
                "Annual technology conference featuring industry leaders",
            },
            date: { type: "string", format: "date", example: "2025-06-15" },
            time: { type: "string", example: "09:00 AM" },
            location: {
              type: "string",
              example: "Convention Center, New York",
            },
            price: { type: "number", example: 99.99 },
            capacity: { type: "number", example: 500 },
            creatorId: {
              type: "string",
              description: "ID of the user who created the event",
              example: "507f1f77bcf86cd799439011",
            },
          },
        },
        Review: {
          type: "object",
          required: ["eventId", "userId", "rating"],
          properties: {
            _id: { type: "string", description: "MongoDB document ID" },
            eventId: {
              type: "string",
              description: "ID of the event being reviewed",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              description: "ID of the user who wrote the review",
              example: "507f1f77bcf86cd799439012",
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
              description: "Rating from 1 to 5",
              example: 4,
            },
            comment: {
              type: "string",
              description: "Review comment",
              example: "Great event, well organized!",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date the review was created",
            },
          },
        },
        Registration: {
          type: "object",
          required: ["eventId", "userId"],
          properties: {
            _id: { type: "string", description: "MongoDB document ID" },
            eventId: {
              type: "string",
              description: "ID of the event",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              description: "ID of the registered user",
              example: "507f1f77bcf86cd799439012",
            },
            registrationDate: {
              type: "string",
              format: "date-time",
              description: "Date of registration",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@gmail.com" },
          },
        },
        UserCreateRequest: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@gmail.com" },
            password: { type: "string", example: "strongPassword123!" },
          },
        },
        UserUpdateRequest: {
          type: "object",
          properties: {
            fullName: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@gmail.com" },
            password: { type: "string", example: "newPassword123!" },
          },
        },
        UserLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@gmail.com" },
            password: { type: "string", example: "strongPassword123!" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./models/*.js", "./routes/swagger-paths/*.yaml"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
