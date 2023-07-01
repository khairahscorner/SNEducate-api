const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const Target = require('./target');
const TermCurriculum = require('./term_curriculum');

class Goal extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Goal.init({
    goal_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    title: { type: DataTypes.STRING, allowNull: false },
    focus_area: { type: DataTypes.STRING, allowNull: false },
    success_criteria: { type: DataTypes.STRING },
    latest_eval: { type: DataTypes.TEXT },
    strategy: { type: DataTypes.TEXT, allowNull: false },
    success_rating: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
}, {
    sequelize,
    modelName: 'Goal'
});

Goal.belongsTo(TermCurriculum, { foreignKey: 'iep_id', targetKey: 'iep_id' });
Goal.hasMany(Target, { foreignKey: 'goal_id', sourceKey: 'goal_id' });

module.exports = Goal;