const Staff = require('../models/staff');
const School = require('../models/school');
const Student = require('../models/student');
const School_Admin = require('../models/school_admin');

const createNewStudent = async (req, res) => {
    const { schoolId, ...otherFields } = req.body;

    try {
        const school = await School.findOne({
            where: {
                school_id: schoolId
            }
        });
        if (!school) {
            return res.status(400).json({
                message: `Cannot create student if the school does not exist`,
                data: {
                    ...req.body
                }
            });
        }
        if (otherFields.staffId) {
            const staff = await Staff.findOne({
                where: {
                    staff_id: otherFields.staffId,
                    school_id: schoolId
                }
            });
            if (!staff) {
                return res.status(400).json({
                    message: `Cannot assign staff that does not exist in the school to student`,
                    data: {
                        staffId: otherFields.staffId
                    }
                });
            }
        }

        const newStudent = await Student.create({
            staff_id: otherFields.staffId,
            school_id: schoolId,
            ...otherFields
        });

        if (newStudent) {
            return res.status(200).json({
                message: "Student created successfully",
                data: {
                    ...newStudent.dataValues,
                },
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};

const assignStudentToStaff = async (req, res) => {
    const { staffId } = req.body;
    const studentId = req.params.studentId;

    const student = await Student.findOne({
        where: {
            student_id: studentId
        }
    });
    if (!student) {
        return res.status(400).json({
            message: `Cannot complete request - student does not exist`,
            data: {
                studentId
            }
        });
    }

    const school = await student.getSchool();
    const staff = await Staff.findOne({
        where: {
            staff_id: staffId,
            school_id: school.dataValues.school_id
        }
    });
    if (!staff) {
        return res.status(400).json({
            message: `Cannot assign staff that does not exist in the school to student`,
            data: {
                staffId,
                schoolId: school.dataValues.school_id
            }
        });
    }

    await student.setStaff(staff);
    return res.status(200).json({
        message: "Student assigned to staff successfully",
        data: {
            student: student.dataValues,
            staff: staff.dataValues
        }
    });
}

const getAllSchoolStudents = async (req, res) => {
    const { userId } = req.user;
    const schoolId = req.params.schoolId;
    try {
        const currAdmin = await School_Admin.findOne({
            where: {
                admin_id: userId,
                school_id: schoolId
            }
        });
        if (!currAdmin) {
            return res.status(400).json({
                message: `Cannot fetch list of students for an admin that does not exist`,
                data: {
                    admin_id: userId,
                    school_id: schoolId
                }
            });
        }
        const school = await currAdmin.getSchool();
        const results = await school.getStudents();
        const gradeCounts = {
            blue: 0,
            green: 0,
            red: 0,
            yellow: 0,
            null: 0
        };

        let studentsWithStaff = await Promise.all(results.map(async (student) => {
            let goals = await student.getGoals();
            let goalRatings = [];
            let currRating = 0;

            if (goals.length > 0) {
                await Promise.all(goals.map(async (goal) => {
                    let targets = await goal.getTargets();
                    targets = targets.map((target) => target.dataValues)
                    goalRatings.push(calcGoalRating(targets))
                }));
                currRating = calcCurrRating(goalRatings)
            }
            const colorGrade =
                currRating > 0 && currRating < 25
                    ? "red"
                    : currRating >= 25 && currRating < 50
                        ? "yellow"
                        : currRating >= 50 && currRating < 75
                            ? "blue"
                            : currRating >= 75 && currRating <= 100
                                ? "green"
                                : "null";
            student.current_rating = currRating;
            student.grade_color = colorGrade;
            gradeCounts[colorGrade]++;
            await student.save();

            let staff = await student.getStaff();
            let user;
            if (staff) {
                user = await staff.getUser();
            }
            return {
                ...student.dataValues,
                staffDetails: staff ? {
                    email: user?.dataValues?.email,
                    ...staff?.dataValues,
                } : null,
            };
        }));

        return res.status(200).json({
            message: "Successfully fetched students",
            data: {
                count: studentsWithStaff.length,
                students: studentsWithStaff,
                stats: [gradeCounts.green, gradeCounts.blue, gradeCounts.yellow, gradeCounts.red, gradeCounts.null]
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getAllStaffStudents = async (req, res) => {
    const staffId = req.params.staffId;
    const schoolId = req.params.schoolId;

    try {
        const staff = await Staff.findOne({
            where: {
                staff_id: staffId,
                school_id: schoolId
            }
        });
        if (!staff) {
            return res.status(400).json({
                message: `Cannot fetch list of students for a staff that does not exist`,
                data: {
                    staff_id: staffId,
                    school_id: schoolId
                }
            });
        }

        const students = await staff.getStudents();
        const gradeCounts = {
            blue: 0,
            green: 0,
            red: 0,
            yellow: 0,
            null: 0
        };

        const allStudents = await Promise.all(students.map(async student => {
            let goals = await student.getGoals();
            let goalCount = goals.length;
            let targetCount = 0;
            let goalRatings = [];
            let currRating = 0;

            if (goalCount > 0) {
                const allTargets = await Promise.all(goals.map(async (goal) => {
                    let targets = await goal.getTargets();
                    targets = targets.map((target) => target.dataValues);
                    goalRatings.push(calcGoalRating(targets));
                    return targets;
                }));
                currRating = calcCurrRating(goalRatings)
                targetCount = allTargets.flat().length;
            }
            const colorGrade =
                currRating > 0 && currRating < 25
                    ? "red"
                    : currRating >= 25 && currRating < 50
                        ? "yellow"
                        : currRating >= 50 && currRating < 75
                            ? "blue"
                            : currRating >= 75 && currRating <= 100
                                ? "green"
                                : "null";
            student.current_rating = currRating;
            student.grade_color = colorGrade;
            gradeCounts[colorGrade]++;
            await student.save();

            return {
                ...student.dataValues,
                goalCount,
                targetCount
            };
        }));


        return res.status(200).json({
            message: "Successfully fetched students",
            data: {
                count: students.length,
                students: allStudents,
                stats: [gradeCounts.green, gradeCounts.blue, gradeCounts.yellow, gradeCounts.red, gradeCounts.null]
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getAllStudents = async (req, res) => {
    try {
        const allStudents = await Student.findAll();
        if (!allStudents) {
            return res.status(400).json({
                message: `Cannot fetch students`,
            });
        }

        return res.status(200).json({
            message: "Successfully fetched students",
            data: {
                count: allStudents.length,
                students: allStudents
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getStudentDetails = async (req, res) => {
    const studentId = req.params.studentId;
    const { userType, userId } = req.user;
    try {
        const student = await Student.findOne({
            where: {
                student_id: studentId
            }
        })
        if (!student) {
            return res.status(400).json({
                message: `Cannot get student that does not exist`,
                studentId
            });
        }

        let loggedInUser;
        //confirm that logged in admin/staff is a part of the school the student is enrolled at
        if (userType === "school_admin") {
            loggedInUser = await School_Admin.findOne({
                where: {
                    admin_id: userId,
                    school_id: student.dataValues.school_id
                }
            })
        }
        else if (userType === "staff") {
            loggedInUser = await Staff.findOne({
                where: {
                    staff_id: userId,
                    school_id: student.dataValues.school_id
                }
            })
        }
        if (!loggedInUser) {
            return res.status(400).json({
                message: `Cannot get student details if not a staff or admin member of student's school`,
            });
        }
        return res.status(200).json({
            message: "Successfully fetched student details ",
            data: student.dataValues
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const calcGoalRating = (targets) => {
    let totalRating = 0;
    if (targets.length > 0) {
        targets.forEach((tar) => {
            totalRating += tar.success_rating;
        });
        return Math.round(totalRating / targets.length);
    }
    return totalRating;
};

const calcCurrRating = (goalRatings) => {
    let totalRating = 0;
    if (goalRatings.length > 0) {
        goalRatings.forEach((rating) => {
            totalRating += rating;
        });
        return Math.round(totalRating / goalRatings.length);
    }
    return totalRating;
};

const updateStudentDetails = async (req, res) => {
    const studentId = req.params.studentId;
    const { userType, userId } = req.user;
    try {
        const student = await Student.findOne({
            where: {
                student_id: studentId
            }
        })
        if (!student) {
            return res.status(400).json({
                message: `Cannot update student that does not exist`,
                studentId
            });
        }

        let schoolId = student.dataValues.school_id;
        let loggedInUser;
        //confirm that logged in admin/staff is a part of the school the student is enrolled at
        if (userType === "school_admin") {
            loggedInUser = await School_Admin.findOne({
                where: {
                    admin_id: userId,
                    school_id: student.dataValues.school_id
                }
            })
        }
        else if (userType === "staff") {
            loggedInUser = await Staff.findOne({
                where: {
                    staff_id: userId,
                    school_id: student.dataValues.school_id
                }
            })
        }
        if (!loggedInUser) {
            return res.status(400).json({
                message: `Cannot update student if not a staff or admin member of student's school`,
            });
        }

        student.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Student details updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update student details",
                    data: {
                        studentId,
                        ...student.dataValues
                    }
                })
            })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const deleteStudent = async (req, res) => {
    const id = req.params.studentId;
    try {
        const student = await Student.findOne({
            where: {
                student_id: id
            }
        });
        if (!student) {
            return res.status(400).json({
                message: `Cannot delete student that does not exist`,
                data: {
                    studentId: id
                }
            });
        }

        const result = await Student.destroy({
            where: {
                student_id: id
            }
        })
        if (result > 0) {
            return res.status(200).json({
                message: "Successfully deleted student",
                data: {
                    ...student.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
}

module.exports = {
    createNewStudent,
    assignStudentToStaff,
    getAllSchoolStudents,
    getAllStaffStudents,
    getAllStudents,
    getStudentDetails,
    updateStudentDetails,
    deleteStudent
};