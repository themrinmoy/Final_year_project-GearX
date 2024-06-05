// routes/mail.js
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: process.env.MAILTRAP_API_KEY
    },
    debug: true // show debug output
});





exports.sendVerificationEmail = (email, token) => {
    transport.sendMail({
        from: 'noreply@mrinmoy.org',
        to: email,
        subject: 'Welcome to GearX - Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                <h1 style="color: #3498db; text-align: center;">Welcome to GearX!</h1>
                <p style="font-size: 16px; text-align: center;">You've successfully signed up!</p>
                <p style="font-size: 16px;">To start exploring, please verify your email address by clicking the link below:</p>
                <p style="font-size: 16px; text-align: center;"><a href="https://gearx.mrinmoy.org/verify/${token}" style="color: #3498db;">Verify Email Address</a></p>
                <p style="font-size: 14px; color: #777;">This link will be valid for 24 hours.</p>
                <p style="font-size: 16px;">If you didn't sign up for GearX, you can ignore this email.</p>
                <p style="font-size: 16px;">Best regards,<br>The GearX Team</p>
            </div>
        `,
    }, (err, info) => {
        if (err) {
            console.error('Error sending verification email:', err);
        } else {
            console.log('Verification email sent to:', email);
        }
    });
}


exports.sendPasswordResetEmail = (email, token) => {
    transport.sendMail({
        from: 'noreply@mrinmoy.org',
        to: email,
        subject: 'Password reset',
        html: `<h1>Reset your password</h1>
            <p>Click this <a href="https://gearx.mrinmoy.org/reset/${token}">link</a> to reset your password.
            This link will be valid for 24 hours.</p>`,
    }, (err, info) => {
        if (err) {
            console.error('Error sending password reset email:', err);
        } else {
            console.log('Password reset email sent to:', email);
        }
    });
}

// successfully account created email
exports.signupSuccess = (email, user) => {
    const emailContent_signup = `
    <html>
    <head>
        <style>
            /* Your CSS styles go here */
        </style>
    </head>
    <body>
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f5f5f5;">
            <h2 style="color: #3498db; text-align: center;">🎉 Welcome to GearX! 🚀</h2>
            <p style="font-size: 16px;">Dear ${user.name},</p>
            <p style="font-size: 16px;">We are thrilled to welcome you to GearX! Your <strong>signup</strong> was <strong>successful</strong>, and you are now part of our community.</p>
            <p style="font-size: 16px;">Thank you for choosing GearX. If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p style="font-size: 16px;">Best regards,<br>The GearX Team</p>
        </div>
    </body>
    </html>
    `;

    const emailTextContent_signup = `
    Welcome to GearX!
    
    Dear ${user.name},
    
    We are thrilled to welcome you to GearX! Your signup was successful, and you are now part of our community.
    
    Thank you for choosing GearX. If you have any questions or need assistance, feel free to reach out to our support team.
    
    Best regards,
    The GearX Team
    `;

    transport.sendMail({
        from: 'noreply@mrinmoy.org',
        to: email,
        subject: 'Welcome to GearX - Signup Successful!',
        html: emailContent_signup, // Use the HTML email content
        text: emailTextContent_signup, // Use the text email content
    }, (err, info) => {
        if (err) {
            console.error('Error sending account creation success email:', err);
        } else {
            console.log('Signup Successful! email sent to:', email);
        }
    });
}
