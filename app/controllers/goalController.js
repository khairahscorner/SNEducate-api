const Goal = require("../models/goal");
const Term_Curriculum = require("../models/term_curriculum");

const createNewGoal = async (req, res) => {
    const { curriculumId, ...otherFields } = req.body;

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
        const newGoal = await Goal.create({ student_id: curriculum.dataValues.student_id, ...otherFields });
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
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const createNewGoals = async (req, res) => {
    const { goals, curriculumId } = req.body;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot create goals for curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }

        const allGoals = await Promise.all(goals.map(async (goalDetails) => {
            const newGoal = await Goal.create({ student_id: curriculum.dataValues.student_id, ...goalDetails });
            if (!newGoal) {
                return res.status(400).json({
                    message: `Error creating goals for curriculum`,
                    data: goalDetails
                });
            }
            return newGoal;
        }));

        await curriculum.addGoals(allGoals);

        return res.status(200).json({
            message: "Successfully created new goals for curriculum",
            data: {
                curriculumId,
                goals: allGoals.map((goal) => goal.dataValues)
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const addGoalToCurriculum = async (req, res) => {
    const { curriculumId, goalId } = req.body;

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
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const addGoalsToCurriculum = async (req, res) => {
    const { curriculumId, goalIds } = req.body;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot add goals to curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }

        const allGoals = await Promise.all(goalIds.map(async (goalId) => {
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
            return goal;
        }));

        await curriculum.addGoals(allGoals);

        return res.status(200).json({
            message: "Successfully added the goals for curriculum",
            data: {
                curriculumId,
                goalIds
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getGoal = async (req, res) => {
    const goalId = req.params.goalId;

    try {
        const goal = await Goal.findOne({
            where: {
                goal_id: goalId
            }
        })
        if (!goal) {
            return res.status(400).json({
                message: `Cannot fetch details of goal that does not exist`,
                data: {
                    goalId
                }
            });
        }
        return res.status(200).json({
            message: "Successfully fetched goal details",
            data: {
                ...goal.dataValues
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const getCurriculumGoals = async (req, res) => {
    const curriculumId = req.params.curriculumId;

    try {
        let curriculum = await Term_Curriculum.findOne({
            where: {
                curriculum_id: curriculumId
            }
        })
        if (!curriculum) {
            return res.status(400).json({
                message: `Cannot fetch goals of curriculum that does not exist`,
                data: {
                    curriculumId
                }
            });
        }
        const allGoals = await curriculum.getGoals({ joinTableAttributes: [] });

        return res.status(200).json({
            message: "Successfully fetched goals of the curriculum",
            data: {
                curriculumId,
                goals: allGoals
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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
        return res.status(500).json({ message: "Internal Server error", error: error.message });
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
        return res.status(500).send({ message: "Internal Server error", error: error.message });
    }
}

module.exports = {
    createNewGoal,
    createNewGoals,
    addGoalToCurriculum,
    addGoalsToCurriculum,
    getGoal,
    updateGoal,
    getCurriculumGoals,
    getGoalCurriculumCount,
    deleteGoal
}