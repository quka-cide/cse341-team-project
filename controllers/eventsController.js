const mongoose = require('mongoose')
const eventsModel = require('../models/events')

//GET all events
async function getEvents(req, res) {
    try {
        const events = await eventsModel.find()
        res.json(events)
    } catch(error) {
        res.status(500).json({ message: 'Error fetching events', error })
    }
}

//POST
async function createEvent(req, res) {
    try {
        const { title, description, date, time, location, price, capacity, creatorId } = req.body
        if(!title || !description) {
            res.status(400).json({ message: 'Title and description are required!' })
        }

        const event = new eventsModel({
            title,
            description,
            date,
            time,
            location,
            price,
            capacity,
            creatorId
        })
        const savedEvent = await event.save()
        res.status(200).json(savedEvent)
    } catch(error) {
        res.status(500).json({ message: 'Error creating event', error })
    }
}

//PUT
async function updateEvent(req, res) {
    try {
        const updatedEvent = await eventsModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        )

        if(!updatedEvent) {
            return res.status(400).json({ message: 'Event not foound' })
        }

        return res.json(updatedEvent)
    } catch(error) {
        res.status(500).json({ message: 'Error updating event', error })
    }
}

//DELETE
async function deleteEvent(req, res) {
    try {
        const deletedEvent = await eventsModel.findOneAndDelete({ _id: req.params.id })
        if(!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' })
        }

        return res.json({ message: 'Event deleted successfully' })

    } catch(error) {
        res.status(500).json({ message: 'Error deleting event', error })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}