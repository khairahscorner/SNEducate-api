const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const User = require('./user')

class Staff extends User {
    // can define methods here that can be used for easy field access in the controllers
}

Staff.init({
    staff_id: {
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
    position: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    modelName: 'Staff',
    hooks: {
        beforeCreate: (staff) => {
            staff.user_type = 'staff';
        }
    }
});

module.exports = Staff;