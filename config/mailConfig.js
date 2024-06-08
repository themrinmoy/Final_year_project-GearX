module.exports = {
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: process.env.MAILTRAP_API_KEY
    },
    debug: true // show debug output
};
