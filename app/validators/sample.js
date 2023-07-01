const { body, validationResult } = require('express-validator');

const parentRegistrationValidator = [
    body('name').notEmpty().withMessage('Your Name is required'),
    body('phone_no').notEmpty().withMessage('Your Phone Number is required'),
    body('child_name').notEmpty().withMessage('Your child_name is required'),
    body('gender').notEmpty().withMessage('Your Gender is required'),
    body('child_age').notEmpty().withMessage('Your child_age is required'),
    body('child_gender').notEmpty().withMessage('Your child_gender is required'),
    body('password').notEmpty().withMessage('Your Password is required'),
    body('email').notEmpty().withMessage('Your Email is required').isEmail().withMessage('Please input a valid email'),
    body('email').custom(async (value) => {
        // Check if email already exists in the database
        const exists = await checkIfEmailExists(value);
        if (exists) {
            throw new Error('This Email already exists');
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'Failed',
                message: errors.array()
            });
        }
        next();
    }
];

// Helper function to check if email exists in the database
async function checkIfEmailExists(email) {
    try {
        const parent = await Parent.findOne({ email });
        return parent !== null;
    } catch (error) {
        // Handle any errors that occur during the database query
        throw new Error('Failed to check if email exists');
    }
}

module.exports = parentRegistrationValidator;
