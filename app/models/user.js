const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class User extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM,
        values: ['dev', 'school_admin', 'staff'],
        defaultValue: "dev",
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;