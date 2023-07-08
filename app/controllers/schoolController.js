const School = require('../models/school');
const School_Admin = require('../models/school_admin');
const User = require('../models/user');

const createSchool = async (req, res) => {
    const { name } = req.body;
    try {
        const school = await School.findOne({
            where: {
                name: name.toLowerCase().trim()
            }
        });
        if (school) {
            return res.status(400).json({
                message: `School with the same name already exists`,
                data: name
            });
        }

        const newSchool = await School.create({
            ...req.body
        });

        if (newSchool) {
            return res.status(200).json({
                message: "School created successfully",
                data: {
                    ...newSchool.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const updateSchool = async (req, res) => {
    const schoolId = req.params.schoolId;

    try {
        const school = await School.findByPk(schoolId);
        if (!school) {
            return res.status(400).json({
                message: `Cannot update school that does not exist`,
                data: {
                    schoolId,
                    ...req.body
                }
            });
        }

        school.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "School details updated successfully",
                data: result.dataValues
            });
        })
        .catch(() => {
            return res.status(400).json({
                message: "Could not update school details",
                data: {
                    schoolId,
                    ...req.body
                }
            })
        })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
};

const getSchoolDetails = async (req, res) => {
    const schoolId = req.params.schoolId;

    try {
        const school = await School.findByPk(schoolId);
        if (!school) {
            return res.status(400).json({
                message: `Cannot get school details`,
                data: {
                    adminId
                }
            });
        }
        const schoolAdmin = await school.getSchool_Admin();

        return res.status(200).json({
            message: "Request successful",
            data: {
                ...school.dataValues,
                schoolAdmin: {
                    ...schoolAdmin.dataValues
                }
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const getAllSchools = async (req, res) => {
    try {
        const schools = await School.findAll({
            include: School_Admin,
        });
        if (!schools) {
            return res.status(400).json({
                message: `Cannot fetch schools`,
            });
        }

        const allSchoolsAndAdmins = schools.map((school) => {
            const { School_Admin, ...rest } = school.dataValues;
            return {
                ...rest,
                adminDetails: School_Admin,
            };
        });

        return res.status(200).json({
            message: "Request successful",
            data: allSchoolsAndAdmins,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const deleteSchool = async (req, res) => {
    const id = req.params.schoolId;
    try {
        const school = await School.findByPk(id);
        if (!school) {
            return res.status(400).json({
                message: `Cannot delete school that does not exist`,
                data: {
                    schoolId: id
                }
            });
        }
        const hasAdmin = await school.getSchool_Admin();

        if (hasAdmin !== null) {
            // delete user association first, which also deletes the school admin
            User.destroy({
                where: {
                    id: hasAdmin?.admin_id
                }
            })
                .catch(() => {
                    return res.status(500).json({
                        message: "Internal server error",
                        error: "Could not delete user - school admin"
                    });
                });
        }
        const result = await School.destroy({
            where: {
                school_id: id
            }
        });

        if (result > 0) {
            return res.status(200).json({
                message: "Successfully deleted school and all associated user (school admin) accounts",
                data: {
                    ...school.dataValues,
                    adminDetails: hasAdmin
                }
            });
        }

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
}

module.exports = { createSchool, updateSchool, getSchoolDetails, getAllSchools, deleteSchool };