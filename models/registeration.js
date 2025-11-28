const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: {
        type: String, // String ID referencing the event
        required: true
    },
    userId: {
        type: String, // String ID referencing the user (from OAuth)
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
    // You could also add fields like paymentStatus or ticketNumber
});

// Enforce unique registration per user per event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registeration', registrationSchema);