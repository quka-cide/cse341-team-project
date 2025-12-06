const mongoose = require('mongoose')
const eventsModel = require('../models/events')

//GET single event by ID
async function getEventById(req, res) {
    try {
        const eventId = req.params.id; // Extract the ID from the route parameter
        
        // Find the event by its ID
        const event = await eventsModel.findById(eventId);

        if (!event) {
            // If Mongoose finds no document, return 404
            return res.status(404).json({ message: 'Event not found' });
        }

        // Return the found event
        res.status(200).json(event);

    } catch(error) {
        // Handle potential errors, such as an invalid ObjectId format
        // Mongoose will throw a CastError if the ID is malformed
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Event ID format' });
        }
        res.status(500).json({ message: 'Error fetching event by ID', error: error.message })
    }
}

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
        res.status(201).json(savedEvent) 

    } catch(error) {
        res.status(500).json({ message: 'Error creating event', error })
    }
}

//PUT (UPDATE)
async function updateEvent(req, res) {
    try {
        const eventId = req.params.id;
        const updateData = req.body;
        
        // 2. Find Event for Security Check (pre-update check)
        const existingEvent = await eventsModel.findById(eventId);

        if (!existingEvent) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        
        // 💡 SECURITY CHECK PLACEHOLDER (For Week 6/7)
        /* // Once OAuth is set up, we will secure this route by checking the user's ID:
        if (existingEvent.creatorId.toString() !== req.user.id.toString()) {
             return res.status(403).json({ message: 'Forbidden. You do not have permission to update this event.' });
        }
        */

        // 3. Update the event
        const updatedEvent = await eventsModel.findOneAndUpdate(
            { _id: eventId },
            updateData,
            { 
                new: true,      // Return the document after update
                runValidators: true, // Enforce Mongoose schema validation on the updated fields
            }
        )

        if(!updatedEvent) {
            return res.status(500).json({ message: 'Failed to update event in database.' })
        }

        return res.status(200).json(updatedEvent)
        
    } catch(error) {
        // Handle Mongoose validation errors
        res.status(500).json({ 
            message: 'Error updating event.', 
            error: error.message 
        })
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
    getEventById, // <-- New function exported
    createEvent,
    updateEvent,
    deleteEvent
}