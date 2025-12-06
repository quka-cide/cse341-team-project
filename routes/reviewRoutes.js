const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { createReviewValidation, updateReviewValidation } = require('../middleware/validationMiddleware');

router.post('/', createReviewValidation, reviewsController.createReview);
router.put('/:id', updateReviewValidation, reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);
router.get('/:eventId', reviewsController.getReviewsByEvent);
module.exports = router;