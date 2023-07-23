require('dotenv').config();
const envConfig = require('./config');
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || 'development';
const config = envConfig[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // logging: false
    }
);


module.exports = sequelize;
