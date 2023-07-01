const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const Assessment = require('./assessment');
const TermCurriculum = require('./term_curriculum');

class Student extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Student.init({
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    year_enrolled: { type: DataTypes.STRING, allowNull: false },
    grade_color: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Student'
});

Student.belongsTo(Staff, { foreignKey: 'staff_id', targetKey: 'staff_id' });
Student.hasMany(TermCurriculum, { foreignKey: 'student_id', sourceKey: 'student_id' });
Student.hasMany(Assessment, { foreignKey: 'student_id', sourceKey: 'student_id' });

module.exports = Student;