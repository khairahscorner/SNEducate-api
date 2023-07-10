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
    contact_name: { type: DataTypes.STRING, allowNull: false },
    contact_email: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    grade_color: {
        type: DataTypes.STRING,
        defaultValue: null
    }
}, {
    sequelize,
    modelName: 'Student',
    validate: {
        validateRequiredFields() {
            if (!this.contact_email && !this.contact_phone) {
                throw new Error('Either of contact email or phone number must be provided"');
            }
        },
    },
});

module.exports = Student;