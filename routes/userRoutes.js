const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { createUserValidation, updateUserValidation, loginValidation } = require('../middleware/validationMiddleware')
const passport = require('passport')

router.get('/', userController.getUsers)
router.post('/', createUserValidation, userController.createUser)
router.post('/login', loginValidation, userController.login)
router.put('/:id', updateUserValidation, userController.updateUser)
router.delete('/:id', userController.deleteUser)

// --- NEW GOOGLE OAUTH ROUTES ---

// 1. Route to initiate the Google OAuth flow
router.get(
    '/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] // Request access to user's profile and email
    })
);

// 2. Route that Google redirects to after successful login
router.get(
    '/google/redirect', 
    passport.authenticate('google', { failureRedirect: '/login' }), // Use local login route on failure
    userController.googleAuthCallback // Our custom controller to issue JWT
);

module.exports = router