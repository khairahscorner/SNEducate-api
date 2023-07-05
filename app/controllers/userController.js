const User = require('../models/user');

const createNewUser = async (req, res) => {
    const { email, password, } = req.body;
    try {
        const newUser = await User.create({
            email: email.toLowerCase(),
            // user_type: req.body.user_type ? req.body.user_type : "dev",
            password
        });

        if (newUser) {
            let token = await newUser.generateToken();
            return res.status(200).json({
                message: "User created successfully",
                data: {
                    ...newUser.dataValues,
                    token
                }
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email: email.toLowerCase()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect login details: email",
            });
        }

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
            return res.json({
                message: "Incorrect login details: password",
            });
        }

        const userToken = await user.generateToken();

        return res.json({
            message: "Successfully logged in",
            data: {
                ...user.dataValues,
                token: userToken
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const changePassword = async (req, res) => {
    // user object added to req from decoding token via middleware
    const { userId, isVerified } = req.user;
    const {oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Error changing password - No user found",
                data: {
                    userId
                }
            });
        }

        const isCurrPasswordValid = await user.verifyPassword(oldPassword);
        if (!isCurrPasswordValid) {
            return res.json({
                message: "Cannot update password - incorrect password",
            });
        }

        user.password = newPassword;
        if(!isVerified) {
            user.isVerified = true;
        }
        await user.save();

        return res.json({
            message: "Successfully changed password",
            data: {
                ...user.dataValues
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }

}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({
            where: {
                id
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Cannot delete user that does not exist",
            });
        }

        const result = await User.destroy({
            where: {
                id
            }
        });

        if (result > 0) {
            return res.json({
                message: "Successfully deleted user",
                data: {
                    email: user.email,
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
}

module.exports = { login, createNewUser, changePassword, deleteUser };
