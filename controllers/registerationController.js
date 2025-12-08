const registrationModel = require("../models/registeration");
// Removed 'mongodb' and 'ObjectId' imports

//GET
async function getRegistrations(req, res) {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const registrations = await registrationModel.find({ eventId: eventId });

    if (registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No registrations found for this event" });
    }

    return res.json(registrations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching registrations", error });
  }
}

//POST
const createRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // 1. Validation: Ensure Event ID and User ID are present
    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ message: "Event ID and User ID are required." });
    }

    // 2. Logic to prevent duplicate registrations (Mongoose findOne)
    const existingRegistration = await registrationModel.findOne({
      eventId: eventId,
      userId: userId,
    });

    if (existingRegistration) {
      return res
        .status(409)
        .json({ message: "User is already registered for this event." });
    }

    // 3. Create and save the registration using the Mongoose Model
    const registration = new registrationModel({
      eventId,
      userId,
      // registrationDate uses the model's default
    });

    const savedRegistration = await registration.save();

    res.status(201).json(savedRegistration);
  } catch (err) {
    // Mongoose will handle errors here
    res.status(500).json({
      message: "Error creating registration.",
      error: err.message,
    });
  }
};

// PUT (UPDATE) Registration
const updateRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const { eventId, userId } = req.body;

    // 1. Validation: Check for empty body
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Request body cannot be empty for an update." });
    }

    // 2. Validation: If eventId or userId are being updated, ensure they are valid
    if (eventId !== undefined && !eventId) {
      return res.status(400).json({ message: "Event ID cannot be empty." });
    }
    if (userId !== undefined && !userId) {
      return res.status(400).json({ message: "User ID cannot be empty." });
    }

    // 3. Check if registration exists
    const existingRegistration = await registrationModel.findById(
      registrationId
    );
    if (!existingRegistration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // 4. If changing eventId or userId, check for duplicate registration
    const newEventId = eventId || existingRegistration.eventId;
    const newUserId = userId || existingRegistration.userId;

    if (eventId || userId) {
      const duplicateRegistration = await registrationModel.findOne({
        eventId: newEventId,
        userId: newUserId,
        _id: { $ne: registrationId }, // Exclude current registration
      });

      if (duplicateRegistration) {
        return res
          .status(409)
          .json({ message: "User is already registered for this event." });
      }
    }

    // 5. Update the registration
    const updatedRegistration = await registrationModel.findByIdAndUpdate(
      registrationId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRegistration);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid Registration ID format." });
    }
    res
      .status(500)
      .json({ message: "Error updating registration.", error: error.message });
  }
};

// DELETE Registration
const deleteRegistration = async (req, res) => {
  try {
    // Mongoose findByIdAndDelete handles the ID conversion implicitly
    const deletedRegistration = await registrationModel.findByIdAndDelete(
      req.params.id
    );

    if (deletedRegistration) {
      res.status(200).json({ message: "Registration successfully deleted." });
    } else {
      res.status(404).json({ message: "Registration not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting registration.", error: error.message });
  }
};

module.exports = {
  getRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
};
