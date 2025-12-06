const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const auth = require('../middleware/authMiddleware')
const { createEventValidation, updateEventValidation } = require('../middleware/validationMiddleware')

router.get('/', eventsController.getEvents)
router.get('/:id', eventsController.getEventById)
router.post('/', auth, createEventValidation, eventsController.createEvent)
router.put('/:id', updateEventValidation, eventsController.updateEvent)
router.delete('/:id', auth, eventsController.deleteEvent)

module.exports = router