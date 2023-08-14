const Student = require('../models/student');
const Assessment = require('../models/assessment');

const createNewAssessment = async (req, res) => {
    const { studentId, ...otherFields } = req.body;
    const { userId } = req.user;

    try {
        const student = await Student.findOne({
            where: {
                student_id: studentId
            }
        });
        if (!student) {
            return res.status(400).json({
                message: `Cannot create assessment for student that does not exist`,
                data: {
                    ...req.body
                }
            });
        }
        if (student.staff_id != userId) {
            return res.status(400).json({
                message: `Cannot create assessment for a student not assigned to you`,
                data: {
                    userId,
                    studentId
                }
            });
        }
        // if (otherFields?.targets_ratings.length === 0) {
        //     return res.status(400).json({
        //         message: `Cannot create assessment without targets addressed`,
        //         data: {
        //             ...req.body
        //         }
        //     });
        // }

        const newAssessment = await Assessment.create({
            student_id: studentId,
            ...otherFields
        });
        if (!newAssessment) {
            return res.status(400).json({
                message: `Cannot create assessment`,
                data: {
                    userId,
                    studentId
                }
            });
        }
        return res.status(200).json({
            message: "Assessment created successfully",
            data: {
                ...newAssessment.dataValues,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};

const getAllStudentAssessment = async (req, res) => {
    const studentId = req.params.studentId;
    const { userId } = req.user;

    try {
        const student = await Student.findOne({
            where: {
                student_id: studentId
            }
        });
        if (!student) {
            return res.status(400).json({
                message: `Cannot get assessments for student that does not exist`,
                data: {
                    studentId
                }
            });
        }
        if (student.staff_id != userId) {
            return res.status(400).json({
                message: `Cannot get assessments for a student not assigned to you`,
                data: {
                    userId,
                    studentId
                }
            });
        }

        const assessments = await student.getAssessments();
        if (!assessments) {
            return res.status(400).json({
                message: `Cannot get assessments`
            });
        }
        return res.status(200).json({
            message: "Successfully fetched assessments",
            data: {
                count: assessments.length,
                assessments
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getSingleAssessment = async (req, res) => {
    const id = req.params.assessmentId;
    const { userId } = req.user;

    try {
        const assessment = await Assessment.findOne({
            where: {
                id
            }
        });
        if (!assessment) {
            return res.status(400).json({
                message: `Cannot get assessment that does not exist`,
                data: {
                    assessmentId: id
                }
            });
        }

        const student = await Student.findOne({
            where: {
                student_id: assessment.dataValues.student_id
            }
        });
        if (userId !== student.dataValues.staff_id) {
            return res.status(400).json({
                message: `Cannot get assessment for a student not assigned to you`,
                data: {
                    studentId: assessment.dataValues.student_id,
                    userId
                }
            });
        }

        return res.status(200).json({
            message: "Successfully fetched assessment",
            data: {
                ...assessment.dataValues
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const updateAssessment = async (req, res) => {
    const assessmentId = req.params.assessmentId;

    try {
        const assessment = await Assessment.findOne({
            where: {
                id: assessmentId
            }
        });
        if (!assessment) {
            return res.status(400).json({
                message: `Cannot update assessment that does not exist`,
                data: {
                    ...req.body
                }
            });
        }
        if (!req.body?.targets_ratings || req.body?.targets_ratings.length === 0) {
            return res.status(400).json({
                message: `Cannot update assessment without any targets addressed`,
                data: {
                    ...req.body
                }
            });
        }


        assessment.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Assessment details updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update assessment",
                    data: {
                        id,
                        ...assessment.dataValues
                    }
                })
            })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};

const deleteAssessment = async (req, res) => {
    const id = req.params.assessmentId;
    try {
        const assessment = await Assessment.findOne({
            where: {
                id
            }
        });
        if (!assessment) {
            return res.status(400).json({
                message: `Cannot delete assessment that does not exist`,
                data: {
                    ...req.body
                }
            });
        }

        const result = await Assessment.destroy({
            where: {
                id
            }
        })
        if (result > 0) {
            return res.json({
                message: "Successfully deleted assessment",
                data: {
                    ...assessment.dataValues
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
}

module.exports = {
    createNewAssessment,
    getAllStudentAssessment,
    getSingleAssessment,
    updateAssessment,
    deleteAssessment
};