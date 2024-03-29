const Term_Curriculum = require("../models/term_curriculum");

const createNewCurriculum = async (req, res) => {
    const { academic_year, term, studentId } = req.body;

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

        return res.status(200).json({
            message: "Successfully created curriculum",
            data: {
                ...newCurriculum.dataValues
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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
        let allGoals = await curriculum.getGoals({ joinTableAttributes: [] });
        allGoals = await Promise.all(allGoals.map(async (goal) => {
            let targets = await goal.getTargets();
            return {
                ...goal.dataValues,
                targets: targets.map((target) => target.dataValues)
            };
        }));

        return res.status(200).json({
            message: "Successfully fetched curriculum details",
            data: {
                ...curriculum.dataValues,
                goals: allGoals
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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

        let allCurriculumWithGoals = await Promise.all(allCurriculum.map(async (curr) => {
            let goals = await curr.getGoals({ joinTableAttributes: [] });

            goals = await Promise.all(goals.map(async (goal) => {
                let targets = await goal.getTargets();
                targets = targets.map((target) => target.dataValues);
                goal.success_rating = calcGoalRating(targets);
                await goal.save()

                return {
                    ...goal.dataValues,
                    targets
                };
            }));

            curr.progress_rating = calcCurrRating(goals);
            await curr.save();

            return {
                ...curr.dataValues,
                goals
            };
        }));

        return res.status(200).json({
            message: "Successfully fetched all curriculum of the student",
            data: {
                studentId,
                count: allCurriculumWithGoals.length,
                curriculums: allCurriculumWithGoals
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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
        return res.status(500).send({ message: "Internal Server error", error: error.message });
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

        curriculum.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Curriculum updated successfully",
                data: result.dataValues
            });
        })
            .catch((error) => {
                return res.status(400).json({
                    message: "Could not update curriculum",
                    error
                })
            })
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

const calcCurrRating = (goals) => {
    let totalRating = 0;
    if (goals.length > 0) {
        goals.forEach((goal) => {
            totalRating += calcGoalRating(goal.targets);
        });
        return Math.round(totalRating / goals.length);
    }
    return totalRating;
};

module.exports = {
    createNewCurriculum,
    getCurriculumDetails,
    updateCurriculum,
    deleteCurriculum,
    getAllStudentCurriculum
}