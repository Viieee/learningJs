const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
      user: "viiieee@outlook.com",
      pass: "Kenway99."
  }
});
