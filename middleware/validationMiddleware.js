const { body, param, validationResult } = require('express-validator');

// --- Helper Middleware to Handle Results ---
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    // Format errors for a cleaner response
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    // Send a 400 status with validation errors
    return res.status(400).json({
        errors: extractedErrors,
    });
};

// --- Event Validation Rules ---

const createEventValidation = [
    // Validation for POST /events
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
    body('date')
        .notEmpty().withMessage('Date is required.')
        .isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date format.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.'),
    body('capacity')
        .optional()
        .isInt({ min: 1 }).withMessage('Capacity must be a number greater than 0.'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    
    validate // Run the error checker
];

const updateEventValidation = [
    // Validation for PUT /events/:id - all fields are optional for update
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
    body('date')
        .optional()
        .isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date format.'),
    body('capacity')
        .optional()
        .isInt({ min: 1 }).withMessage('Capacity must be a number greater than 0.'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    
    validate
];

// --- User Validation Rules ---

const createUserValidation = [
    // Validation for POST /users
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required.'),
    body('email')
        .trim()
        .isEmail().withMessage('Must be a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
        
    validate
];

const updateUserValidation = [
    // Validation for PUT /users/:id
    body('fullName')
        .optional()
        .trim()
        .notEmpty().withMessage('Full name cannot be empty.'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Must be a valid email address.')
        .normalizeEmail(),
    // Note: If you allow password updates, it's best to handle hashing in the controller/model
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
        
    validate
];

const loginValidation = [
    // Validation for POST /users/login
    body('email')
        .trim()
        .isEmail().withMessage('Must be a valid email address.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.'),

    validate
];

// --- Registration Validation Rules ---

const createRegistrationValidation = [
    // Validation for POST /registrations
    body('eventId')
        .notEmpty().withMessage('Event ID is required.')
        .isMongoId().withMessage('Event ID must be a valid ID format.'),
    body('userId')
        .notEmpty().withMessage('User ID is required.')
        .isMongoId().withMessage('User ID must be a valid ID format.'),
    
    validate // Run the error checker
];

const updateRegistrationValidation = [
    // Validation for PUT /registrations/:id
    // Allow either field to be updated, but ensure it's a valid ID if present.
    body('eventId')
        .optional()
        .isMongoId().withMessage('Event ID must be a valid ID format.'),
    body('userId')
        .optional()
        .isMongoId().withMessage('User ID must be a valid ID format.'),
    
    validate
];


// --- Review Validation Rules ---

const createReviewValidation = [
    // Validation for POST /reviews
    body('eventId')
        .notEmpty().withMessage('Event ID is required.')
        .isMongoId().withMessage('Event ID must be a valid ID format.'),
    body('userId')
        .notEmpty().withMessage('User ID (creator) is required.')
        .isMongoId().withMessage('User ID must be a valid ID format.'),
    body('rating')
        .notEmpty().withMessage('Rating is required.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
    body('comment')
        .optional()
        .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters.'),
    
    validate
];

const updateReviewValidation = [
    // Validation for PUT /reviews/:id
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
    body('comment')
        .optional()
        .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters.'),
    
    validate
];

module.exports = {
    createEventValidation,
    updateEventValidation,
    createUserValidation,
    updateUserValidation,
    loginValidation,
    createRegistrationValidation,
    updateRegistrationValidation,
    createReviewValidation,
    updateReviewValidation
};