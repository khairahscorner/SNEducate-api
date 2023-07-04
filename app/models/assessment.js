const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Student = require('./student');

class Assessment extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Assessment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    week: { type: DataTypes.INTEGER, allowNull: false },
    targets_addressed: { type: DataTypes.JSON, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    updated_ratings: { type: DataTypes.JSON, allowNull: false },
    prev_ratings: { type: DataTypes.JSON, allowNull: false },
    baseline_summary:  { type: DataTypes.TEXT, allowNull: false },
    improvement:  { type: DataTypes.TEXT, allowNull: false },
    comments: DataTypes.TEXT,  
}, {
    sequelize,
    modelName: 'Assessment'
});

Assessment.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
Student.hasMany(Assessment, { foreignKey: 'student_id', sourceKey: 'student_id' });

module.exports = Assessment;