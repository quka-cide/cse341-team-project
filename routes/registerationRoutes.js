const express = require('express');
const router = express.Router();
const registrationsController = require('../controllers/registerationController');

router.post('/', registrationsController.createRegistration)
router.delete('/:id', registrationsController.deleteRegistration)

module.exports = router