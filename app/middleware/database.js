const sequelize = require("../../config/database");

//ensure to import all models
require("../models/assessment");
require("../models/goal");
require("../models/school");
require("../models/school_admin");
require("../models/staff");
require("../models/student");
require("../models/target");
require("../models/term_curriculum");
require("../models/user");

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