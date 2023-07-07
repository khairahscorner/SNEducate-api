const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Student extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Student.init({
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

module.exports = Student;