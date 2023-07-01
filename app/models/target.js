const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const Goal = require('./goal');

class Target extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Target.init({
    target_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    title: { type: DataTypes.STRING, allowNull: false },
    success_rating: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    prev_rating: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    notes: { type: DataTypes.TEXT },
}, {
    sequelize,
    modelName: 'Target'
});

Target.belongsTo(Goal, { foreignKey: 'goal_id', targetKey: 'goal_id' });

module.exports = Target;