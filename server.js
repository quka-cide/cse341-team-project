const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const routes = require('./routes')

const app = express()
app.use(cors())
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
    app.use('/api', routes)
    app.listen(port, () => {
        console.log(`Server running on ${port}`)
    })
})