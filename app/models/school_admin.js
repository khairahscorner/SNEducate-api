const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database");
const User = require('./user')
const School = require('./school')

class SchoolAdmin extends User {
    // can define methods here that can be used for easy field access in the controllers
}

SchoolAdmin.init({
    admin_id: {
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
    role: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    modelName: 'SchoolAdmin'
});

SchoolAdmin.beforeCreate((admin) => {
    admin.user_type = 'school_admin';
});

SchoolAdmin.belongsTo(User, { foreignKey: 'admin_id', targetKey: 'user_id' });
SchoolAdmin.belongsTo(School, { foreignKey: 'school_id', targetKey: 'school_id' });

module.exports = SchoolAdmin;