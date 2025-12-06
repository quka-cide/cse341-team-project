const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const routes = require('./routes')
// Swagger setup imports
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
// NEW IMPORTS:
const passport = require('passport')
const session = require('express-session'); // Required for sessions/passport state
const initializePassport = require('./config/passport'); // Import your config
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json())

// Configure Express Session (IMPORTANT for Passport OAuth flow)
app.use(session({
    secret: process.env.SESSION_SECRET || 'a very secret key', // Use a strong secret from .env
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Initialize Passport (MUST come after session middleware)
app.use(passport.initialize());
app.use(passport.session()); // Use if you are using session-based authentication

initializePassport; // Runs the configuration file

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

async function connectDB() {
    try {
     await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected')
    } catch(error) {
        console.error('MongoDB connection error', error)
        process.exit(1)
    }
}

const port = process.env.PORT || 8080

connectDB().then(() => {
    // Swagger UI setup
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
            oauth: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                usePkceWithAuthorizationCodeGrant: true,
                scopes: ["profile", "email"]
            }
        })
    );

    app.use('/api', routes) 
    
    app.listen(port, () => {
        console.log(`Server running on ${port}`)
        // 🚀 Add a log to remind us of the documentation URL
        console.log(`API Documentation available at http://localhost:${port}/api-docs`)
    })
})