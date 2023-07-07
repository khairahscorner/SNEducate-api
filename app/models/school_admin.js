const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const User = require('./user')
const School = require('./school')

class School_Admin extends User {
    // can define methods here that can be used for easy field access in the controllers
}

School_Admin.init({
    admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
}, {
    sequelize,
    modelName: 'School_Admin',
    hooks: {
        beforeCreate: (admin) => { }
    }
});

module.exports = School_Admin;