const Goal = require("../models/goal");
const Term_Curriculum = require("../models/term_curriculum");
const { newGoalFunc, getGoalDetails } = require("./goalController");

const createNewCurriculum = async (req, res) => {
    const { academic_year, term, goals, studentId } = req.body;

    try {
        const newCurriculum = await Term_Curriculum.create({
            student_id: studentId,
            academic_year,
            term,
            progress_rating: req.body?.progress_rating
        });
        if (!newCurriculum) {
            return res.status(400).json({
                message: `Cannot create curriculum`,
                data: req.body
            });
        }

        if (goals.length === 0) {
            return res.status(400).json({
                message: `Cannot create curriculum without goals`,
                data: req.body
            });
        }
        else {
            const assignedGoals = await Promise.all(goals.map(async (goal) => {
                if (goal.id) {
                    console.log("exists");
                    return await getGoalDetails(goal.id);
                } else {
                    return await newGoalFunc(goal);
                }
            }));

            await newCurriculum.addGoals(assignedGoals);

            return res.status(200).json({
                message: "Successfully created curriculum",
                data: {
                    ...newCurriculum.dataValues,
                    goals: assignedGoals.map((goal) => goal.dataValues)
                },
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const getCurriculumDetails = async (req, res) => {
    const curriculumId = req.params.curriculumId;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot fetch details of curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }
        const allGoals = await curriculum.getGoals({ joinTableAttributes: [] });

        return res.status(200).json({
            message: "Successfully fetched curriculum details",
            data: {
                ...curriculum.dataValues,
                goals: allGoals
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const getAllStudentCurriculum = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        let allCurriculum = await Term_Curriculum.findAll({
            where: {
                student_id: studentId
            }
        })
        if (!allCurriculum) {
            return res.status(400).json({
                message: `Cannot fetch all curriculums of a student that do not exist`,
                data: {
                    studentId
                }
            });
        }

        const allCurriculumWithGoals = await Promise.all(allCurriculum.map(async (curr) => {
            let goals = await curr.getGoals({ joinTableAttributes: [] });
            return {
                ...curr.dataValues,
                goals: goals.map((goal) => goal.dataValues)
            };
        }));

        return res.status(200).json({
            message: "Successfully fetched all curriculum of the student",
            data: {
                studentId,
                curriculums: allCurriculumWithGoals
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const deleteCurriculum = async (req, res) => {
    const curriculumId = req.params.curriculumId;
    try {
        const curriculum = await Term_Curriculum.findByPk(curriculumId);
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot delete curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }

        await curriculum.destroy();
        return res.status(200).json({
            message: "Successfully deleted curriculum",
            data: {
                ...curriculum.dataValues
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
}

//pick up from here
const updateCurriculum = async (req, res) => {
    const curriculumId = req.params.curriculumId;
    try {
        const curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot update curriculum that does not exist`,
                curriculumId
            });
        }

        goal.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Curriculum updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update curriculum",
                    data: {
                        goalId,
                        ...req.body
                    }
                })
            })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

module.exports = {
    createNewCurriculum,
    getCurriculumDetails,
    deleteCurriculum,
    getAllStudentCurriculum
}