const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Staff = require('./staff');

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
Staff.hasMany(Student, { foreignKey: 'staff_id', sourceKey: 'staff_id' })
module.exports = Student;