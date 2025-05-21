// dotenv config setup
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  NOTIFICATION_RECEIVERS: process.env.NOTIFICATION_RECEIVERS,
  NOTIFICATION_CC: process.env.NOTIFICATION_CC,
};