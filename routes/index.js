const express = require( 'express')
const router = express.Router()
const eventRoutes = require('./eventRoutes')

router.use('/events', eventRoutes)
router.use('/reviews', require('./reviewRoutes'));
router.use('/registrations', require('./registerationRoutes'));

module.exports = router