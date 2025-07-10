const nodemailer = require("nodemailer");

const sendEmail = async (opt) => {
  // caeate transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // create mail options
  const mailOptions = {
    from: "Natours <customerhelp@natours.com>",
    to: opt.email,
    subject: opt.subject,
    text: opt.message,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail
