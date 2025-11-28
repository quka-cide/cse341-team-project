const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    eventId: {
        type: String, // Storing as a string initially, referencing the event's ID
        required: true
    },
    userId: {
        type: String, // Storing as a string initially, referencing the user's ID
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming a standard 1-5 star rating system
    },
    comment: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);