const sequelize = require("../../config/database");

//ensure to import all models
// const Assessment = require("../models/assessment");
// const Goal = require("../models/goal");
const School = require("../models/school");
const School_Admin = require("../models/school_admin");
const Staff = require("../models/staff");
const Student = require("../models/student");
// const Target = require("../models/target");
// const Term_Curriculum = require("../models/term_curriculum");
const User = require("../models/user");

//associations
School_Admin.belongsTo(User, { foreignKey: { name: 'admin_id', allowNull: false }, onDelete: 'CASCADE', targetKey: 'id' });
User.hasOne(School_Admin, { foreignKey: { name: 'admin_id', allowNull: false }, onDelete: 'CASCADE', sourceKey: 'id' });

Staff.belongsTo(User, { foreignKey: { name: 'staff_id', allowNull: false },  onDelete: 'CASCADE', targetKey: 'id' });
User.hasOne(Staff, { foreignKey: { name: 'staff_id', allowNull: false }, onDelete: 'CASCADE', sourceKey: 'id' });

School_Admin.belongsTo(School, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', targetKey: 'school_id' });
School.hasOne(School_Admin, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', sourceKey: 'school_id' });

Staff.belongsTo(School, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', targetKey: 'school_id' });
School.hasMany(Staff, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', sourceKey: 'school_id' });

Student.belongsTo(School, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', targetKey: 'school_id' });
School.hasMany(Student, { foreignKey: { name: 'school_id', allowNull: false }, onDelete: 'CASCADE', sourceKey: 'school_id' });
Student.belongsTo(Staff, { foreignKey: 'staff_id', targetKey: 'staff_id' });
Staff.hasMany(Student, { foreignKey: 'staff_id', sourceKey: 'staff_id' });

// Assessment.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
// Student.hasMany(Assessment, { foreignKey: 'student_id', sourceKey: 'student_id' });

// Term_Curriculum.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'student_id' });
// Student.hasMany(Term_Curriculum, { foreignKey: 'student_id', sourceKey: 'student_id' });

// Goal.belongsTo(Term_Curriculum, { foreignKey: 'iep_id', targetKey: 'iep_id' });
// Term_Curriculum.hasMany(Goal, { foreignKey: 'iep_id', sourceKey: 'iep_id' });

// Target.belongsTo(Goal, { foreignKey: 'goal_id', targetKey: 'goal_id' });
// Goal.hasMany(Target, { foreignKey: 'goal_id', sourceKey: 'goal_id' });


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