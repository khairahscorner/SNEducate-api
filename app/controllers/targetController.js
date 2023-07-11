const Goal = require('../models/goal');
const Target = require('../models/target');

const createNewTarget = async (req, res) => {
    const { goalId, ...otherFields } = req.body;

    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        });
        if (!goal) {
            return res.status(400).json({
                message: `Cannot create target for goal that does not exist`,
                data: {
                    ...req.body
                }
            });
        }

        const newTarget = await Target.create({
            goal_id: goalId,
            ...otherFields
        });

        if (newTarget) {
            return res.status(200).json({
                message: "Target created successfully",
                data: {
                    goalId,
                    ...newTarget.dataValues,
                },
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
};

const updateTarget = async (req, res) => {
    const targetId = req.params.targetId;
    try {
        const target = await Target.findOne({
            where: {
                target_id: targetId
            }
        })
        if (!target) {
            return res.status(400).json({
                message: `Cannot update target that does not exist`,
                targetId
            });
        }

        target.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Target details updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update target",
                    data: {
                        targetId,
                        ...target.dataValues
                    }
                })
            })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const getTargetDetails = async (req, res) => {
    const targetId = req.params.targetId;
    try {
        const target = await Target.findOne({
            where: {
                target_id: targetId
            }
        })
        if (!target) {
            return res.status(400).json({
                message: `Cannot get target that does not exist`,
                targetId
            });
        }
        return res.status(200).json({
            message: "Successfully fetched target details",
            data: {
                ...target.dataValues
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const getGoalTargets = async (req, res) => {
    const goalId = req.params.goalId;
    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot fetch targets for a goal that does not exist`,
                goalId
            });
        }
        const results = await goal.getTargets();

        return res.status(200).json({
            message: "Successfully fetched targets",
            data: {
                goalId,
                targets: results.map((target) => target.dataValues)
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const deleteTarget = async (req, res) => {
    const targetId = req.params.targetId;
    try {
        const target = await Target.findOne({
            where: {
                target_id: targetId
            }
        });
        if (!target) {
            return res.status(400).json({
                message: `Cannot delete target that does not exist`,
                data: {
                    targetId
                }
            });
        }

        const result = await Target.destroy({
            where: {
                target_id: targetId
            }
        })
        if (result > 0) {
            return res.json({
                message: "Successfully deleted target",
                data: {
                    ...target.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
}

// const assignStudentToStaff = async (req, res) => {
//     const { staffId } = req.body;
//     const studentId = req.params.studentId;

//     const student = await Student.findOne({
//         where: {
//             student_id: studentId
//         }
//     });
//     if (!student) {
//         return res.status(400).json({
//             message: `Cannot complete request - student does not exist`,
//             data: {
//                 studentId
//             }
//         });
//     }

//     const school = await student.getSchool();
//     const staff = await Staff.findOne({
//         where: {
//             staff_id: staffId,
//             school_id: school.dataValues.school_id
//         }
//     });
//     if (!staff) {
//         return res.status(400).json({
//             message: `Cannot assign staff that does not exist in the school to student`,
//             data: {
//                 staffId,
//                 schoolId: school.dataValues.school_id
//             }
//         });
//     }

//     await student.setStaff(staff);
//     return res.status(200).json({
//         message: "Student assigned to staff successfully",
//         data: {
//             student: student.dataValues,
//             staff: staff.dataValues
//         }
//     });
// }

// const getAllSchoolStudents = async (req, res) => {
//     const { userId } = req.user;
//     const schoolId = req.params.schoolId;
//     try {
//         const currAdmin = await School_Admin.findOne({
//             where: {
//                 admin_id: userId,
//                 school_id: schoolId
//             }
//         });
//         if (!currAdmin) {
//             return res.status(400).json({
//                 message: `Cannot fetch list of students for an admin that does not exist`,
//                 data: {
//                     admin_id: userId,
//                     school_id: schoolId
//                 }
//             });
//         }
//         const school = await currAdmin.getSchool();
//         const results = await school.getStudents();
//         return res.status(200).json({
//             message: "Successfully fetched students",
//             data: {
//                 count: results.length,
//                 students: results
//             },
//         });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server error", error });
//     }
// }

// const getAllStaffStudents = async (req, res) => {
//     const staffId = req.params.staffId;
//     const schoolId = req.params.schoolId;

//     try {
//         const staff = await Staff.findOne({
//             where: {
//                 staff_id: staffId,
//                 school_id: schoolId
//             }
//         });
//         if (!staff) {
//             return res.status(400).json({
//                 message: `Cannot fetch list of students for a staff that does not exist`,
//                 data: {
//                     staff_id: staffId,
//                     school_id: schoolId
//                 }
//             });
//         }

//         const students = await staff.getStudents();

//         return res.status(200).json({
//             message: "Successfully fetched students",
//             data: {
//                 count: students.length,
//                 students
//             },
//         });

//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server error", error });
//     }
// }

// const getAllStudents = async (req, res) => {
//     try {
//         const allStudents = await Student.findAll();
//         if (!allStudents) {
//             return res.status(400).json({
//                 message: `Cannot fetch students`,
//             });
//         }

//         return res.status(200).json({
//             message: "Successfully fetched students",
//             data: {
//                 count: allStudents.length,
//                 students: allStudents
//             },
//         });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server error", error });
//     }
// }

module.exports = {
    createNewTarget,
    getTargetDetails,
    updateTarget,
    deleteTarget,
    getGoalTargets
};