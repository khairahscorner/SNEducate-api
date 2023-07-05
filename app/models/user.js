const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require("../../config/database");

class User extends Model {
    // can define methods here that can be used for easy field access in the controllers
    async generateToken() {
        return jwt.sign(
            { userId: this.id, userType: this.user_type, isVerified: this.isVerified },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "6h",
            }
        );
    }

    async verifyPassword(password) {
        const isPasswordCorrect = await bcrypt.compare(password, this.password);
        return isPasswordCorrect;
    }
}

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM,
        values: ['dev', 'school_admin', 'staff'],
        defaultValue: "dev"
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                user.password = hashedPassword;
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                user.password = hashedPassword;
            }
        },
    }
});

module.exports = User;