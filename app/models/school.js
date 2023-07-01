const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const SchoolAdmin = require('./school_admin');

class School extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

School.init({
    school_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: false
    },
    framework: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: DataTypes.STRING,
    terms_private: DataTypes.STRING,
    terms_school: DataTypes.JSON
}, {
    sequelize,
    modelName: 'School'
});

School.hasOne(SchoolAdmin, { foreignKey: 'school_id', sourceKey: 'school_id' });
School.hasMany(Staff, { foreignKey: 'school_id', sourceKey: 'school_id' });

module.exports = School;