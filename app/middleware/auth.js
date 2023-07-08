
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const generate = require('generate-password');

const doesEmailExists = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email.toLowerCase()
            }
        });
        if (user) {
            return res.status(400).json({
                message: `A user already exists with the same email`,
                data: req.body.email
            });
        }
        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const isUserActivated = async (req, res, next) => {
    const { isVerified } = req.user;
    try {
        if (!isVerified) {
            return res.status(400).json({
                message: `User has not activated their account `,
                data: {
                    userId: req.user.userId
                }
            });
        }
        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorised - no token' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorised - Invalid token' });
        }
        req.user = decoded; // Store the decoded user information in the request object
        next();
    });
};

const generateRandomPassword = () => {
    const passwordOptions = {
        numbers: true,
        lowercase: true,
        uppercase: true,
    };
    return generate.generate(passwordOptions);
}

module.exports = {
    doesEmailExists,
    isUserActivated,
    verifyToken,
    generateRandomPassword,
};