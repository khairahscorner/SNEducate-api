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

module.exports = Goal;