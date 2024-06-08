// Used for sending emails to users
// Uses nodemailer to send emails
// services/mailService.js
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
// check if the domain is in production or development

const domain = process.env.NODE_ENV === 'production' ? `https://${process.env.DOMAIN}` : `http://localhost:${process.env.PORT}` || 'http://localhost:3000';
// const domain = `https://${process.env.DOMAIN}` || 'http://localhost:3000';



console.log('domain in mailing section:', domain);


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
                <p style="font-size: 16px; text-align: center;"><a href="${domain}/verify/${token}" style="color: #3498db;">Verify Email Address</a></p>
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


// password reset email
exports.passwordReset = (user, token) => {
    const emailContent_passwordReset = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 20px;
                border: 1px solid #ddd;
            }
            .header {
                text-align: center;
                color: #3498db;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
            }
            .button {
                display: block;
                width: fit-content;
                margin: 20px auto;
                padding: 10px 20px;
                background-color: #3498db;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
            }
            .footer {
                font-size: 14px;
                color: #777777;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Reset Your Password</div>
            <div class="content">
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${domain}/reset-password/${token}" class="button">Reset Password</a>
                <p>This link will be valid for 24 hours. If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>The GearX Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} GearX. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;

    const emailTextContent_passwordReset = `
    Reset Your Password

    Hello ${user.name},

    We received a request to reset your password. Click the link below to reset it:

    ${domain}/reset-password/${token}

    This link will be valid for 24 hours. If you did not request a password reset, please ignore this email.

    Best regards,
    The GearX Team

    &copy; ${new Date().getFullYear()} GearX. All rights reserved.
    `;

    transport.sendMail({
        from: 'noreply@mrinmoy.org',
        to: user.email,
        subject: 'Password Reset Request',
        html: emailContent_passwordReset,
        text: emailTextContent_passwordReset,
    }, (err, info) => {
        if (err) {
            console.error('Error sending password reset email:', err);
        } else {
            console.log('Password reset email sent to:', user.email);
        }
    });
}

// successfully account created email
exports.signupSuccess = ( user) => {
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
        to: user.email,
        subject: 'Welcome to GearX - Signup Successful!',
        html: emailContent_signup, // Use the HTML email content
        text: emailTextContent_signup, // Use the text email content
    }, (err, info) => {
        if (err) {
            console.error('Error sending account creation success email:', err);
        } else {
            console.log('Signup Successful! email sent to:', user.email);
        }
    });
}
