const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.createReview);
router.delete('/:id', reviewsController.deleteReview);
router.get('/:eventId', reviewsController.getReviewsByEvent); 

module.exports = router;