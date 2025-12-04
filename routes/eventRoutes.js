const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const auth = require('../middleware/authMiddleware')


router.get('/', eventsController.getEvents)
router.get('/:id', eventsController.getEventById)
router.post('/', auth, eventsController.createEvent)
router.put('/:id', eventsController.updateEvent)
router.delete('/:id', auth, eventsController.deleteEvent)

module.exports = router