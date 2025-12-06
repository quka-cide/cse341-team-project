const express = require('express');
const router = express.Router();
const registrationsController = require('../controllers/registerationController');
const { createRegistrationValidation, updateRegistrationValidation } = require('../middleware/validationMiddleware');

router.get('/:eventId', registrationsController.getRegistrations)
router.post('/', createRegistrationValidation, registrationsController.createRegistration)
router.put('/:id', updateRegistrationValidation, registrationsController.updateRegistration)
router.put('/:id', registrationsController.updateRegistration)

module.exports = router