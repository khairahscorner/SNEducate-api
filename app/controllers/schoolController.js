const School = require('../models/school');

const createSchool = async (req, res) => {
    const { name } = req.body;
    try {
        const school = await School.findOne({
            where: {
                name: name.toLowerCase().trim()
            }
        });
        if (school) {
            return res.status(400).json({
                message: `School with the same name already exists`,
                data: name
            });
        }

        const newSchool = await School.create({
            ...req.body
        });

        if (newSchool) {
            return res.status(200).json({
                message: "School created successfully",
                data: {
                    ...newSchool.dataValues
                }
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal server error", error });
    }
};

module.exports = { createSchool };