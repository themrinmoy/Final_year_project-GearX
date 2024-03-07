const nodemailer = require('nodemailer');


var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: "c486150b023a89dbe3d0ba4d260d2baf"
    }
});

// transport.sendMail({
//     to: req.body.email,
//     from: 'npreply@mrinmoy.org',

//     subject: 'Password Reset Request',
//     html: personalizedEmailContent,
//     text: emailTextContent_reset
// });


const transport = nodemailer.createTransport(emailConfig);

module.exports = transport;