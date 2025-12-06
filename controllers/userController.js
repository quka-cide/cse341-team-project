const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//GET all users
async function getUsers(req, res) {
    try {
        const users = await userModel.find()
        res.json(users)
    } catch(error) {
        res.status(500).json({ message: 'Error fetching users', error })
    }
}

//GET single user by ID
async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);

    } catch(error) {
        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }
        res.status(500).json({ message: 'Error fetching user by ID', error: error.message });
    }
}

//POST
async function createUser(req, res) {
    try {
        const { fullName, email, password } = req.body
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email & password are required!' })
        }

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
        const user = await userModel.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const valid = await bcrypt.compare(password, user.password)
        if(!valid) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.json({token})
    } catch(error) {
        res.status(500).json({ message: 'Login error', error })
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login
}