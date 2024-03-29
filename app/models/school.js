const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class School extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

School.init({
    school_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['school', 'private'],
        defaultValue: "school",
        allowNull: false
    },
    staff_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shortcode: {
        type: DataTypes.STRING,
        // allowNull: false,
        // unique: true
    },
    framework: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        // allowNull: false
    },
    website: DataTypes.STRING,
    terms_private: DataTypes.STRING,
    terms_school: DataTypes.JSON
}, {
    sequelize,
    modelName: 'School',
    validate: {
        validateRequiredFields() {
            if (this.type === 'private' && !this.terms_private) {
                throw new Error('terms_private is required if school type is "private"');
            }

            if (this.type === 'school' && !this.terms_school) {
                throw new Error('terms_school is required if school type is "school"');
            }
        },
    },
});

module.exports = School;