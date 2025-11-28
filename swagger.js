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
        url: 'http://localhost:3000/api', // Update our local server port/base route
        description: 'Local Development Server'
      },
    ],
    components: {
        securitySchemes: {
            githubAuth: {
                type: 'oauth2',
                description: 'OAuth2 authentication flow for GitHub.',
                flows: {
                    authorizationCode: {
                        // The user will be redirected to this URL to authorize your app
                        authorizationUrl: 'https://github.com/login/oauth/authorize',
                        // Your server will exchange the code here to get an access token
                        tokenUrl: 'https://github.com/login/oauth/access_token',
                        scopes: {
                            'user:email': 'Grants read access to a user’s primary email address.',
                            'read:user': 'Grants access to user profile information.'
                        }
                    }
                }
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
  apis: ['./routes/*.js', './models/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;