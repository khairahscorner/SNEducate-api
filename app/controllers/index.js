const School_Admin = require("../models/school_admin");
const Staff = require("../models/staff");
const Term_Curriculum = require("../models/term_curriculum");

const getStudentReport = async (req, res) => {
    const studentId = req.params.studentId;
    const { userId } = req.user;
    const { curriculumId } = req.body;
    try {
        const staff = await Staff.findOne({
            where: {
                staff_id: userId
            }
        });
        if (!staff) {
            return res.status(400).json({
                message: "Cannot generate report for staff that does not exist",
            });
        }
        const curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId,
            }
        });
        if (!curriculum) {
            return res.status(400).json({
                message: "Cannot generate report for student - invalid options",
            });
        }
        const student = await curriculum.getStudent();
        if (student.dataValues.staff_id != userId) {
            return res.status(400).json({
                message: "Cannot generate report for a student you are not assigned to",
            });
        }
        let stats = {
            goalCount: 0,
            targetCount: 0,
            assessmentCount: 0
        }

        const assessmentsCount = await student.countAssessments();
        let goals = await curriculum.getGoals();

        let allTargets = [];
        await Promise.all(goals.map(async (goal) => {
            let targets = await goal.getTargets();
            targets = targets.map((target) => ({
                goalName: goal.dataValues.focus_area,
                ...target.dataValues
            }))
            allTargets.push(...targets)
        }));

        stats.goalCount = goals.length;
        stats.targetCount = allTargets.length;
        stats.assessmentCount = assessmentsCount;

        const school = await staff.getSchool();

        return res.status(200).json({
            message: "Successfully fetched report details",
            data: {
                schoolName: school.dataValues.name,
                generatedBy: staff.dataValues.first_name + " " + staff.dataValues.last_name,
                generatedAt: new Date(),
                studentId,
                generatedFor: student.dataValues.first_name + " " + student.dataValues.last_name,
                session: curriculum.dataValues.academic_year + ", " + curriculum.dataValues.term,
                currentGrade: student.grade_color,
                currentRating: student.current_rating,
                stats,
                targets: allTargets
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
};

const getGroupReport = async (req, res) => {
    const { userId } = req.user;
    try {
        const staff = await Staff.findOne({
            where: {
                staff_id: userId
            }
        });
        if (!staff) {
            return res.status(400).json({
                message: "Cannot generate report for unauthorised staff",
            });
        }

        let groups = {
            blueGroup: [],
            greenGroup: [],
            redGroup: [],
            yellowGroup: [],
            ungraded: []
        }

        let staffStudents = await staff.getStudents();
        staffStudents = staffStudents.map((student) => student.dataValues);
        if (staffStudents.length > 0) {
            staffStudents.forEach((student) => {
                student.grade_color == "yellow" ? groups.yellowGroup.push({ studentName: student.first_name + " " + student.last_name, rating: student.current_rating }) :
                    student.grade_color == "green" ? groups.greenGroup.push({ studentName: student.first_name + " " + student.last_name, rating: student.current_rating }) :
                        student.grade_color == "blue" ? groups.blueGroup.push({ studentName: student.first_name + " " + student.last_name, rating: student.current_rating }) :
                            student.grade_color == "red" ? groups.redGroup.push({ studentName: student.first_name + " " + student.last_name, rating: student.current_rating }) :
                                groups.ungraded.push({ studentName: student.first_name + " " + student.last_name, rating: student.current_rating });
            });
        }

        const school = await staff.getSchool();

        return res.status(200).json({
            message: "Successfully fetched group report details",
            data: {
                schoolName: school.dataValues.name,
                generatedBy: staff.dataValues.first_name + " " + staff.dataValues.last_name,
                generatedAt: new Date(),
                studentCount: staffStudents.length,
                groups,
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
};

const getSchoolReport = async (req, res) => {
    const { userId } = req.user;
    try {
        const admin = await School_Admin.findOne({
            where: {
                admin_id: userId
            }
        });
        if (!admin) {
            return res.status(400).json({
                message: "Cannot generate report for unauthorised admin",
            });
        }

        let schoolStaff = await Staff.findAll({
            where: { school_id: admin.school_id }
        })
        let groups = {
            blueGroup: [],
            greenGroup: [],
            redGroup: [],
            yellowGroup: [],
            ungraded: []
        }

        schoolStaff = await Promise.all(schoolStaff.map(async staff => {
            let assignedStudents = await staff.getStudents()
            assignedStudents = assignedStudents.map((student) => student.dataValues);
            assignedStudents.forEach((student) => {
                student.grade_color == "yellow" ? groups.yellowGroup.push(student.current_rating) :
                    student.grade_color == "green" ? groups.greenGroup.push(student.current_rating) :
                        student.grade_color == "blue" ? groups.blueGroup.push(student.current_rating) :
                            student.grade_color == "red" ? groups.redGroup.push(student.current_rating) :
                                groups.ungraded.push(student.current_rating);
            });

            return {
                staff: staff.dataValues,
                studentCount: assignedStudents.length,
                groups
            };
        }));

        const school = await admin.getSchool();
        const totalStudentCount = await school.countStudents();

        return res.status(200).json({
            message: "Successfully fetched group report details",
            data: {
                schoolId: admin.school_id,
                schoolName: school.dataValues.name,
                generatedBy: admin.dataValues.first_name + " " + admin.dataValues.last_name,
                generatedAt: new Date(),
                staffCount: schoolStaff.length,
                totalStudentCount,
                groups,
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
};

module.exports = {
    getStudentReport,
    getGroupReport,
    getSchoolReport
};
