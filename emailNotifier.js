const nodemailer = require("nodemailer");
const env = require("./config/env.config");

// Setup transporter (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

/**
 * Send an email notification.
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
async function sendEmailNotification(subject, html) {
  try {
    const mailOptions = {
      from: env.EMAIL_USER,
      to: env.NOTIFICATION_RECEIVERS,
      cc: env.NOTIFICATION_CC,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent:", subject);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmailNotification };
