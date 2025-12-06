const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// --- JWT GENERATION HELPER ---
function generateAuthToken(user) {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

//GET
async function getUsers(req, res) {
    try {
        const users = await userModel.find()
        res.json(users)
    } catch(error) {
        res.status(500).json({ message: 'Error fetching users', error })
    }
}

//POST
async function createUser(req, res) {
    try {
        const { fullName, email, password } = req.body

        const existingUser = await userModel.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({ message: 'User registered successfully', userId: newUser._id })
    } catch(error) {
        res.status(500).json({ message: 'Error creating user', error })
    } 
}

//PUT
async function updateUser(req, res) {
    try {
            const updated = await userModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if(!updated) {
           return res.status(400).json({ message: 'User not found' })
        }
        res.status(200).json(updated)
    } catch(error) {
        res.status(500).json({ message: 'Error updating user', error })
    }
}

//DELETE
async function deleteUser(req, res) {
    try {
        const deleted = await userModel.findByIdAndDelete(req.params.id)
        if(!deleted) {
            return res.status(404).json({  message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch(error) {
        res.status(500).json({ message: 'Error deleting user', error })
    }
}

//LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body
        
        // 1. FIX: Explicitly select the password hash
        const user = await userModel.findOne({ email }).select('+password') 
        
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const valid = await bcrypt.compare(password, user.password)
        if(!valid) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = generateAuthToken(user) // Use helper function
        res.json({token})
    } catch(error) {
        res.status(500).json({ message: 'Login error', error })
    }
}

// NEW FUNCTION: Google OAuth Callback Handler
async function googleAuthCallback(req, res) {
    // req.user is populated by passport-google-oauth20 strategy if successful
    if (req.user) {
        // 1. Generate the same JWT token used for local login
        const token = generateAuthToken(req.user); 
        
        // 2. Redirect to a frontend URL with the token, or return JSON
        // For API, returning JSON is easier for testing:
        return res.status(200).json({ 
            message: 'Google login successful',
            token: token,
            user: req.user 
        });
        
        
    } else {
        return res.status(401).json({ message: 'Google authentication failed' });
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    login,
    googleAuthCallback
}