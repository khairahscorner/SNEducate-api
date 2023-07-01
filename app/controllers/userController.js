const User = require('../models/user');
const SchoolAdmin = require('../models/school_admin');

exports.createAdmin = async () => {
    const details = {
        email: "airahyusuff@gmail.com",
        password: "asdfgh12345wsdfghgfds",
        first_name: "Aierah",
        last_name: "Yuusdd",
        role: "Propietor"
    };
    try {
        const res = await SchoolAdmin.create(details);
        console.log(res.toJSON());
        // res.status(200).json({
        //     status: "Success",
        //     data: formattedBook
        // });
    } catch (error) {
        console.error('Failed to create a new record : ', error);
    }
};