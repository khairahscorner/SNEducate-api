const { Op } = require('sequelize');
const School = require('../models/school');
const School_Admin = require('../models/school_admin');
const Staff = require('../models/staff');
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
        return res.status(500).send({ message: "Internal Server error", error: error.message });
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
        return res.status(500).send({ message: "Internal Server error", error: error.message });
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
                schoolAdmin: schoolAdmin ? {
                    ...schoolAdmin.dataValues
                } : null
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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

        const allSchoolsAndAdmins = await Promise.all(schools.map(async (school) => {
            const { School_Admin, ...rest } = school.dataValues;
            let user;

            if (School_Admin) {
                user = await User.findByPk(School_Admin.admin_id);
            }
            return {
                ...rest,
                adminDetails: user ? {
                    email: user?.dataValues?.email,
                    ...School_Admin?.dataValues,
                }: null,
            };
        }));

        return res.status(200).json({
            message: "Request successful",
            data: {
                count: allSchoolsAndAdmins.length,
                schools: allSchoolsAndAdmins
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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

        let staffResults = await school.getStaffs()
        staffIds = staffResults.map((staff) => staff.dataValues.staff_id);
        let adminResult = await school.getSchool_Admin();
        let adminId = adminResult.dataValues.admin_id;

        await User.destroy({
            where: {
                id: {
                    [Op.in]: staffIds,
                }
            },
        })
        if (adminId) {
            await User.destroy({
                where: {
                    id: adminId,
                },
            });
        }

        await school.destroy();
        return res.status(200).json({
            message: "Successfully deleted school and all associated user (school admin) accounts",
            data: {
                ...school.dataValues,
                adminId,
                staffIds
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
}

module.exports = { createSchool, updateSchool, getSchoolDetails, getAllSchools, deleteSchool };