const Goal = require("../models/goal");
const Term_Curriculum = require("../models/term_curriculum");

const createNewGoal = async (req, res) => {
    const curriculumId = req.params.curriculumId;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot add new goal to curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }
        const newGoal = await Goal.create(req.body);
        if (!newGoal) {
            return res.status(400).json({
                message: `Cannot create new goal for the curriculum`,
                curriculumId,
                goal: req.body
            });
        }
        await curriculum.addGoal(newGoal);
        return res.status(200).json({
            message: "Goal created and added successfully to curriculum",
            data: {
                curriculumId,
                goal: newGoal.dataValues
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const updateGoal = async (req, res) => {
    const goalId = req.params.goalId;
    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot update goal that does not exist`,
                goalId
            });
        }

        goal.update(req.body, {
            returning: true
        }).then((result) => {
            return res.status(200).json({
                message: "Goal updated successfully",
                data: result.dataValues
            });
        })
            .catch(() => {
                return res.status(400).json({
                    message: "Could not update goal",
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

const addGoalToCurriculum = async (req, res) => {
    const { curriculumId } = req.body;
    const goalId = req.params.goalId;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot add goal to curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot add goal that does not exist to the curriculum`,
                curriculumId,
                goalId
            });
        }
        await curriculum.addGoal(goal);
        return res.status(200).json({
            message: "Goal added successfully to curriculum",
            data: {
                curriculumId,
                goal: goal.dataValues
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}
// note, to for the FE, check if goal belongs to more than one curriculum
const getGoalCurriculumCount = async (req, res) => {
    const goalId = req.params.goalId;
    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot get curriculum count of goal that does not exist`,
                goalId
            });
        }

        let curriculumCount = await goal.countTerm_Curriculums();
        return res.status(200).json({
            message: "Fetched successfully",
            data: {
                goalId,
                count: curriculumCount
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error });
    }
}

const deleteGoal = async (req, res) => {
    const goalId = req.params.goalId;
    try {
        const goal = await Goal.findByPk(goalId);
        if (!goal) {
            return res.status(400).json({
                message: `Cannot delete goal that does not exist`,
                data: {
                    goalId
                }
            });
        }

        await goal.destroy();
        return res.status(200).json({
            message: "Successfully deleted goal from all curriculums it is attached to",
            data: {
                ...goal.dataValues,
                goalId
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
}

//functions
// both used in curriculumController
const newGoalFunc = async (details) => {
    try {
        const newGoal = await Goal.create(details);
        if (!newGoal) {
            throw new Error("Error creating goal");
        }
        return newGoal;
    } catch (error) {
        throw new Error("Error creating goal");
    }
}
const getGoalDetails = async (goalId) => {
    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot get details of goal that does not exist`,
                goalId
            });
        }
        return goal;
    } catch (error) {
        throw new Error("Error fetching goal details")
    }
}
// end

module.exports = {
    newGoalFunc,
    createNewGoal,
    addGoalToCurriculum,
    getGoalDetails,
    updateGoal,
    getGoalCurriculumCount,
    deleteGoal
}