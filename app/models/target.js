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
    modelName: 'Target'
});

module.exports = Target;