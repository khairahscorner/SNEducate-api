const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const Goal = require('./goal');
const Student = require('./student');

class TermCurriculum extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

TermCurriculum.init({
    iep_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    academic_year: { type: DataTypes.STRING, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    progress_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TermCurriculum'
});

TermCurriculum.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
TermCurriculum.hasMany(Goal, { foreignKey: 'iep_id', sourceKey: 'iep_id' });

module.exports = TermCurriculum;