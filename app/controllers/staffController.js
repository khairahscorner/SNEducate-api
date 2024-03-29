const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Staff = require('../models/staff');
const School = require('../models/school');

const { generateRandomPassword } = require('../middleware/auth');
const { sendActivationEmail } = require('../../config/mail');

const env = process.env.NODE_ENV || 'development';
const activationBaseUrl = env === "development" ? process.env.FRONTEND_URL : process.env.PROD_FRONTEND_URL

const createNewStaff = async (req, res) => {
    const { email, firstName, lastName, position, schoolId } = req.body;
    const autogeneratedPassword = generateRandomPassword();

    try {
        const school = await School.findOne({
            where: {
                school_id: schoolId
            }
        });
        if (!school) {
            return res.status(400).json({
                message: `Cannot create staff if the school does not exist`,
                data: {
                    ...req.body
                }
            });
        }

        // if staff count has exceeded specified
        const existingStaff = await school.countStaffs();
        if (existingStaff === school.staff_count) {
            return res.status(400).json({
                message: `Maximum number of staff for this school has been exceeded. Please contact support to increase limit`
            });
        }
        const newUser = await User.create({
            email: email.toLowerCase(),
            password: autogeneratedPassword,
            user_type: "staff"
        });

        if (newUser) {
            await newUser.createStaff({
                first_name: firstName,
                last_name: lastName,
                position,
                staff_id: newUser.dataValues.id,
                school_id: schoolId
            });
            const newStaff = await newUser.getStaff();

            if (newStaff) {
                let token = await generateActivationToken({
                    userId: newUser.dataValues.id,
                    userType: newUser.dataValues.user_type,
                    isVerified: newUser.dataValues.isVerified
                });

                let mailOptions = {
                    userType: "staff",
                    activationLink: `${activationBaseUrl}/verify?token=${token}`,
                    email,
                    password: autogeneratedPassword,
                    schoolName: school.name
                };
                if (token) {
                    await sendActivationEmail(mailOptions);
                    return res.status(200).json({
                        message: "Staff created successfully & activation email was sent",
                        data: {
                            ...newStaff.dataValues,
                            activationLink: mailOptions.activationLink
                        },
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Could not send email to staff`,
                        data: {
                            ...newStaff.dataValues
                        }
                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};

const getStaffDetails = async (req, res) => {
    const { userId } = req.user;

    try {
        const currStaff = await Staff.findOne({
            where: {
                staff_id: userId
            }
        });
        if (!currStaff) {
            return res.status(400).json({
                message: `Cannot fetch staff profile`,
                data: {
                    staff_id: userId
                }
            });
        }
        const user = await currStaff.getUser();
        const schoolDetails = await currStaff.getSchool();

        return res.status(200).json({
            message: "Successfully fetched profile",
            data: {
                email: user.dataValues.email,
                ...currStaff.dataValues,
                schoolDetails
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getSingleStaff = async (req, res) => {
    const staffId = req.params.id;

    try {
        const staff = await Staff.findOne({
            where: {
                staff_id: staffId
            }
        });
        if (!staff) {
            return res.status(400).json({
                message: `Cannot get staff details`,
                data: {
                    staffId
                }
            });
        }

        const user = await staff.getUser();
        return res.status(200).json({
            message: "Request successful",
            data: {
                email: user.dataValues.email,
                ...staff.dataValues
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getAllSchoolStaff = async (req, res) => {
    const schoolId = req.params.schoolId;
    try {
        const currSchool = await School.findByPk(schoolId);
        if (!currSchool) {
            return res.status(400).json({
                message: `Cannot fetch staff of school that does not exist`,
            });
        }
        const schlAdmin = await currSchool.getSchool_Admin();
        if (schlAdmin.dataValues.school_id != schoolId) {
            return res.status(400).json({
                message: `Cannot fetch staff of school you're not an admin of`,
            });
        }

        let allStaff = await Staff.findAll({
            where: { school_id: schoolId }
        });
        if (!allStaff) {
            return res.status(400).json({
                message: `Error fetching school staff`,
            });
        }

        allStaff = await Promise.all(allStaff.map(async staff => {
            const userDetails = await staff.getUser();
            const studentCount = await staff.countStudents();
            return {
                ...staff.dataValues,
                email: userDetails.dataValues.email,
                isVerified: userDetails.dataValues.isVerified,
                studentCount
            };
        }));

        return res.status(200).json({
            message: "Request successful",
            data: {
                count: allStaff.length,
                staffs: allStaff
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getAllStaff = async (req, res) => {
    try {
        let allStaff = await Staff.findAll();
        if (!allStaff) {
            return res.status(400).json({
                message: `Cannot fetch staff`,
            });
        }

        const staffDetails = await Promise.all(allStaff.map(async staff => {
            const schoolDetails = await staff.getSchool();
            return {
                ...staff.dataValues,
                schoolDetails: schoolDetails.dataValues
            };
        }));

        return res.status(200).json({
            message: "Request successful",
            data: {
                count: staffDetails.length,
                staff: staffDetails
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const updateStaff = async (req, res) => {
    const staffId = req.params.staffId;

    try {
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            return res.status(400).json({
                message: `Cannot update staff that does not exist`,
                data: {
                    staffId,
                    ...req.body
                }
            });
        }

        staff.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Staff details updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update staff details",
                    data: {
                        staffId: staff.dataValues.staff_id,
                        ...req.body
                    }
                })
            })
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
};

const deleteStaff = async (req, res) => {
    const id = req.params.staffId;
    try {
        const staff = await Staff.findOne({
            where: {
                staff_id: id
            }
        });
        if (!staff) {
            return res.status(400).json({
                message: `Cannot delete staff that does not exist`,
                data: {
                    staffId: id
                }
            });
        }

        const result = await User.destroy({
            where: {
                id
            }
        })
        if (result > 0) {
            return res.status(200).json({
                message: "Successfully deleted staff",
                data: {
                    ...staff.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
}

const resetUserPassword = async (req, res) => {
    const userId = req.params.userId;
    const autogeneratedPassword = generateRandomPassword();

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({
                message: `Cannot reset password for user that does not exist`,
                data: {
                    userId
                }
            });
        }
        user.password = autogeneratedPassword;
        user.isVerified = false;
        await user.save();

        console.log(user)

        let token = await generateActivationToken({
            userId: user.dataValues.id,
            userType: user.dataValues.user_type,
            isVerified: user.dataValues.isVerified
        });

        let mailOptions = {
            userType: user.dataValues.user_type,
            activationLink: `${activationBaseUrl}/verify?token=${token}`,
            email: user.dataValues.email,
            password: autogeneratedPassword,
            subject: "Password Reset - SNEducate"
        };
        if (token) {
            await sendActivationEmail(mailOptions, "reset.html");
            return res.status(200).json({
                message: "Password reset successfully & reactivation email was sent",
                data: {
                    ...user.dataValues,
                    activationLink: mailOptions.activationLink
                },
            });
        }
        else {
            return res.status(400).json({
                message: `Could not send reactivation email`,
                data: {
                    ...user.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }

}


const generateActivationToken = async ({ userId, userType, isVerified }) => {
    return jwt.sign(
        { userId, userType, isVerified },
        process.env.JWT_SECRET_KEY,
        // { // no expiration
        //     expiresIn: "24h",
        // }
    );
}

module.exports = {
    createNewStaff,
    getStaffDetails,
    getSingleStaff,
    getAllSchoolStaff,
    getAllStaff,
    updateStaff,
    deleteStaff,
    resetUserPassword
};