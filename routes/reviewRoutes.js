const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.createReview);
router.delete('/:id', reviewsController.deleteReview);
// Vitalina's GET route will go here
// router.get('/event/:eventId', reviewsController.getReviewsByEvent); 

module.exports = router;