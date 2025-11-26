const mongoose = require('mongoose')

const eventsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date },
    time: { type: String },
    location: { type: String },
    price: { type: Number },
    capacity: { type: Number },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'creator', required: true }
})

module.exports = mongoose.model('events', eventsSchema)