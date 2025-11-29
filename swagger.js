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
        url: 'http://localhost:8080/api', // Update our local server port/base route
        description: 'Local Development Server'
      },
    ],
    components: {
        securitySchemes: {
            googleAuth: { // <-- RENAMED TO MATCH PROJECT
                type: 'oauth2',
                description: 'Google OAuth 2.0 Authentication',
                flows: {
                    implicit: { // Implicit flow is best for client-side documentation testing
                        // Google's OAuth URL
                        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth', 
                        tokenUrl: 'https://oauth2.googleapis.com/token',
                        scopes: {
                            'profile': 'Access to user profile information',
                            'email': 'Access to user email address',
                        },
                    },
                },
            },
        },
        // Define reusable schemas for clarity
        schemas: {
            Event: {
                type: 'object',
                properties: {
                    _id: { type: 'string', description: 'MongoDB document ID' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                    location: { type: 'string' },
                    creatorId: { type: 'string', description: 'ID of the user who created the event' },
                },
            },
            Review: {
                type: 'object',
                properties: {
                    // ... define review fields
                },
            },
            Registration: {
                type: 'object',
                properties: {
                    // ... define registration fields
                },
            },
        }
    }
  },
  // API files containing annotations/JSDoc comments
  apis: ['./routes/*.js', './models/*.js', './routes/swagger-paths/*.yaml' ], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;