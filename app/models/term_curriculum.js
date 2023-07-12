const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Term_Curriculum extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Term_Curriculum.init({
    curriculum_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    academic_year: { type: DataTypes.STRING, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    progress_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Term_Curriculum',
    hooks: {
        beforeUpdate: async (curriculum, options) => {
            const originalCurriculum = await Term_Curriculum.findByPk(curriculum.curriculum_id);

            if (originalCurriculum.student_id !== curriculum.student_id) {
                throw new Error('Updating student_id of the curriculum is not allowed');
            }
        }
    }
});

module.exports = Term_Curriculum;