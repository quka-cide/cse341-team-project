const express = require( 'express')
const router = express.Router()

router.use('/events', require('./eventRoutes'))
router.use('/reviews', require('./reviewRoutes'));
router.use('/registrations', require('./registerationRoutes'));
router.use('/users', require('./userRoutes'))

module.exports = router