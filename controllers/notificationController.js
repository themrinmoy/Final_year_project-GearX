const { MailtrapClient } = require("mailtrap");

const TOKEN = "c486150b023a89dbe3d0ba4d260d2baf";  //mrinmoy.org domain admin

const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@mrinmoy.org",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "themrinmoychakraborty@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);