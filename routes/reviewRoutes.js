const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, reviewsController.createReview);
router.put("/:id", auth, reviewsController.updateReview);
router.delete("/:id", auth, reviewsController.deleteReview);
router.get("/:eventId", reviewsController.getReviewsByEvent);

module.exports = router;
