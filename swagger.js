const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management Platform API',
      version: '1.0.0',
      description: 'The API for managing Events, Registrations, and Reviews for a team project.',
      contact: {
        name: 'Team Quka-Cide',
        url: 'https://github.com/quka-cide/cse341-team-project'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Local Development Server'
      },
      {
        url: 'https://cse341-team-project-kx4l.onrender.com/api',
        description: 'Production Server (Render)'
      }
    ],
    components: {
      securitySchemes: {
        googleAuth: {
          type: 'oauth2',
          description: 'Google OAuth 2.0 Authentication',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                profile: 'Access to user profile information',
                email: 'Access to user email address'
              }
            }
          }
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB document ID' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            creatorId: { type: 'string', description: 'ID of the user who created the event' }
          }
        },
        Review: {
          type: 'object',
          properties: {}
        },
        Registration: {
          type: 'object',
          properties: {}
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@gmail.com' }
          }
        },
        UserCreateRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@gmail.com' },
            password: { type: 'string', example: 'strongPassword123!' }
          }
        },
        UserUpdateRequest: {
          type: 'object',
          properties: {
            fullName: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'jane@gmail.com' },
            password: { type: 'string', example: 'newPassword123!' }
          }
        },
        UserLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@gmail.com' },
            password: { type: 'string', example: 'strongPassword123!' }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './models/*.js',
    './routes/swagger-paths/*.yaml'
  ]
};

const specs = swaggerJsdoc(options);
module.exports = specs;