const registrationModel = require('../models/registeration'); 
// Removed 'mongodb' and 'ObjectId' imports

const createRegistration = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // 1. Validation: Ensure Event ID and User ID are present
        if (!eventId || !userId) {
            return res.status(400).json({ message: 'Event ID and User ID are required.' });
        }

        // 2. Logic to prevent duplicate registrations (Mongoose findOne)
        const existingRegistration = await registrationModel.findOne({
            eventId: eventId,
            userId: userId
        });

        if (existingRegistration) {
            return res.status(409).json({ message: 'User is already registered for this event.' });
        }

        // 3. Create and save the registration using the Mongoose Model
        const registration = new registrationModel({
            eventId,
            userId
            // registrationDate uses the model's default
        });

        const savedRegistration = await registration.save();

        res.status(201).json(savedRegistration);

    } catch (err) {
        // Mongoose will handle errors here
        res.status(500).json({ 
            message: 'Error creating registration.',
            error: err.message 
        });
    }
};

// DELETE Registration
const deleteRegistration = async (req, res) => {
    try {
        // Mongoose findByIdAndDelete handles the ID conversion implicitly
        const deletedRegistration = await registrationModel.findByIdAndDelete(req.params.id);

        if (deletedRegistration) {
            res.status(200).json({ message: 'Registration successfully deleted.' });
        } else {
            res.status(404).json({ message: 'Registration not found.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error deleting registration.', error: error.message });
    }
};

module.exports = {
    createRegistration,
    deleteRegistration
};