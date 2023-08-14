const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Assessment extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Assessment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    week: { type: DataTypes.INTEGER, allowNull: false },
    academic_year: { type: DataTypes.STRING, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    targets_ratings: { type: DataTypes.JSON, allowNull: false },
    baseline_summary: { type: DataTypes.TEXT, allowNull: false },
    improvement: { type: DataTypes.TEXT, allowNull: false },
    comments: DataTypes.TEXT,
}, {
    sequelize,
    modelName: 'Assessment',
    hooks: {
        beforeUpdate: async (assessment, options) => {
            const originalAssessment = await Assessment.findByPk(assessment.id);

            if (originalAssessment.student_id !== assessment.student_id) {
                throw new Error('Updating student_id of the assessment is not allowed');
            }
        }
    }
});

module.exports = Assessment;