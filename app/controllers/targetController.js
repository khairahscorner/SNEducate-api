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

module.exports = {
    createNewTarget,
    getTargetDetails,
    updateTarget,
    deleteTarget,
    getGoalTargets
};