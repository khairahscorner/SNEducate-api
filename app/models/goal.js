const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Goal extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Goal.init({
    goal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    target: { type: DataTypes.STRING, allowNull: false },
    focus_area: { type: DataTypes.STRING, allowNull: false },
    success_criteria: { type: DataTypes.STRING },
    latest_eval: { type: DataTypes.TEXT },
    strategy: { type: DataTypes.TEXT, allowNull: false },
    success_rating: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    sequelize,
    modelName: 'Goal',
    hooks: {
        beforeUpdate: async (goal, options) => {
            const originalGoal = await Goal.findByPk(goal.goal_id);

            if (originalGoal.student_id !== goal.student_id) {
                throw new Error('Updating student_id of the goal is not allowed');
            }
        }
    }
});

module.exports = Goal;