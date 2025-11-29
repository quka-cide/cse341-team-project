const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const routes = require('./routes')
// Swagger setup imports
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json())

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