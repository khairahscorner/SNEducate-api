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
        allowNull: false,
        unique: true
    },
    framework: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        // allowNull: false
    },
    website: DataTypes.STRING,
    terms_private: {
        type: DataTypes.STRING,
        validate: {
            requiredIfTypeIsPrivate: function (val) {
                if (this.type === 'private' && !val) {
                    throw new Error('terms_private required if school typeis= "private"');
                }
            },
        },
    },
    terms_school: {
        type: DataTypes.JSON,
        validate: {
            requiredIfTypeIsSchool: function (val) {
                if (this.type === 'school' && !val) {
                    throw new Error('terms_school required if school type is "school"');
                }
            },
        },
    }
}, {
    sequelize,
    modelName: 'School'
});

module.exports = School;