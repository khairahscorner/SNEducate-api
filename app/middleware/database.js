const sequelize = require("../../config/database");

//ensure to import all models
require("../models/user");
require("../models/school_admin");
require("../models/staff");

const connection = () => {
    try {
        sequelize.authenticate().then(() => {
            console.log('connection established successfully.');
            sequelize.sync().then(() => {
                console.log('All models synced successfully!');
            })
        }).catch((error) => {
            console.error('Error connecting to database: ', error);
        });


    }
    catch (err) {
        console.error(err);
    }
};

module.exports = connection;