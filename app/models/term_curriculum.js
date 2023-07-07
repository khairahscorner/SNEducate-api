const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");

class Term_Curriculum extends Model {
    // can define methods here that can be used for easy field access in the controllers
}

Term_Curriculum.init({
    iep_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    academic_year: { type: DataTypes.STRING, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    progress_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Term_Curriculum'
});

module.exports = Term_Curriculum;