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
          key: 'user_id'
        }
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    modelName: 'Staff'
});

Staff.beforeCreate((staff) => {
    staff.user_type = 'staff';
});

Staff.belongsTo(User, { foreignKey: 'staff_id', targetKey: 'user_id' });
Staff.belongsTo(School, { foreignKey: 'school_id', targetKey: 'school_id' });

module.exports = Staff;