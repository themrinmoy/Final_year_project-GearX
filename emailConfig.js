const nodemailer = require('nodemailer');


var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: "c486150b023a89dbe3d0ba4d260d2baf"
    }
});



const personalizedEmailContent = emailContent_reset
    .replace('{{recipientName}}', name)
    .replace('{{token}}', token);

transport.sendMail({
    to: req.body.email,
    from: 'npreply@mrinmoy.org',

    subject: 'Password Reset Request',
    html: personalizedEmailContent,
    text: emailTextContent_reset
});




const emailContent_reset = `
<html>
<head>
    <style>
        /* Your CSS styles go here */
    </style>
</head>
<body>
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f5f5f5;">

        <h2 style="color: #3498db; text-align: center;">Password Reset Request</h2>

        <p style="font-size: 16px;">Dear {{recipientName}},</p>

        <p style="font-size: 16px;">We received a request to reset the password associated with this email address. If you made this request, click the link below to reset your password:</p>

        <p style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:3000/reset/{{token}}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>

        <p style="font-size: 16px;">If you didn't make this request, you can ignore this email.</p>

        <p style="font-size: 16px; text-align: center;">Best regards,<br>mrinmoy.org</p>

    </div>
</body>
</html>
`;

const emailTextContent_reset = `
Password Reset Request

Dear {{recipientName}},

We received a request to reset the password associated with this email address. If you made this request, click the link below to reset your password:

http://localhost:3000/reset/{{token}}

If you didn't make this request, you can ignore this email.

Best regards,
mrinmoy.org
`;