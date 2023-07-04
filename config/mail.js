const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
    },
});


exports.sendActivationEmail = async (details) => {
    try {
        const templatePath = path.join(__dirname, 'mail-templates', 'activation.html');
        const emailTemplate = fs.readFileSync(templatePath, 'utf-8');

        let html = emailTemplate;
        html = html.replace('{{userType}}', details.userType);
        html = html.replace('{{schoolName}}', details.schoolName);
        html = html.replace('{{email}}', details.email);
        html = html.replace('{{password}}', details.password);
        html = html.replace('{{activationLink}}', details.activationLink);

        transporter.sendMail({
            from: process.env.OUTLOOK_EMAIL,
            to: details.email,
            subject: 'New Account - SNEducate',
            html,
        }, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: err });
            } else console.log(info)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending verification email:' });
    }
};