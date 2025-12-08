const reviewsModel = require("../models/reviews");

//GET
async function getReviewsByEvent(req, res) {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const reviews = await reviewsModel.find({ eventId: eventId });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this event" });
    }

    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews", error });
  }
}

const createReview = async (req, res) => {
  try {
    const { eventId, userId, rating, comment } = req.body;

    // 1. Validation: Mongoose will handle some validation, but we keep the custom checks.
    if (!eventId || !userId || !rating) {
      return res.status(400).json({
        message:
          "Event ID, User ID (creator), and Rating are required to post a review.",
      });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be a number between 1 and 5.",
      });
    }

    // 2. Business Logic: Prevent duplicate reviews (Mongoose findOne)
    const existingReview = await reviewsModel.findOne({
      eventId: eventId,
      userId: userId,
    });

    if (existingReview) {
      return res
        .status(409)
        .json({
          message: "User has already submitted a review for this event.",
        });
    }

    // 3. Create and save the review using the Mongoose Model
    const review = new reviewsModel({
      eventId,
      userId,
      rating,
      comment: comment || "",
      // date will use the default Date.now from the model
    });

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    // Mongoose validation or cast errors will land here
    res.status(500).json({
      message: "Error creating review.",
      error: error.message,
    });
  }
};

// PUT (UPDATE) Review
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { eventId, userId, rating, comment } = req.body;

    // 1. Validation: Check for empty body
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Request body cannot be empty for an update." });
    }

    // 2. Validation: If rating is provided, ensure it's valid
    if (rating !== undefined) {
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be a number between 1 and 5.",
        });
      }
    }

    // 3. Validation: If eventId or userId are being updated, ensure they are not empty
    if (eventId !== undefined && !eventId) {
      return res.status(400).json({ message: "Event ID cannot be empty." });
    }
    if (userId !== undefined && !userId) {
      return res.status(400).json({ message: "User ID cannot be empty." });
    }

    // 4. Check if review exists
    const existingReview = await reviewsModel.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    // 5. If changing eventId or userId, check for duplicate review
    const newEventId = eventId || existingReview.eventId;
    const newUserId = userId || existingReview.userId;

    if (eventId || userId) {
      const duplicateReview = await reviewsModel.findOne({
        eventId: newEventId,
        userId: newUserId,
        _id: { $ne: reviewId }, // Exclude current review
      });

      if (duplicateReview) {
        return res
          .status(409)
          .json({
            message: "User has already submitted a review for this event.",
          });
      }
    }

    // 6. Update the review
    const updatedReview = await reviewsModel.findByIdAndUpdate(
      reviewId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedReview);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Review ID format." });
    }
    res
      .status(500)
      .json({ message: "Error updating review.", error: error.message });
  }
};

// 🗑️ DELETE Review
const deleteReview = async (req, res) => {
  try {
    // Mongoose findByIdAndDelete handles ID conversion and deletion
    const deletedReview = await reviewsModel.findByIdAndDelete(req.params.id);

    if (deletedReview) {
      res.status(200).json({ message: "Review successfully deleted." });
    } else {
      res.status(404).json({ message: "Review not found." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error deleting review.",
      error: error.message,
    });
  }
};

module.exports = {
  getReviewsByEvent,
  createReview,
  updateReview,
  deleteReview,
};
