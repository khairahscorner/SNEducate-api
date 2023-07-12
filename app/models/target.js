const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Target extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Target.init({
    target_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: { type: DataTypes.STRING, allowNull: false },
    success_rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    prev_rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    notes: { type: DataTypes.TEXT },
}, {
    sequelize,
    modelName: 'Target',
    hooks: {
        beforeUpdate: async (target, options) => {
            const originalTarget = await Target.findByPk(target.target_id);

            if (originalTarget.goal_id !== target.goal_id) {
                throw new Error('Updating goal_id is not allowed');
            }
        }
    }
});

module.exports = Target;