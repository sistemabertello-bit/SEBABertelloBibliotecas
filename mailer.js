// app/mailer.js
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tu.email@gmail.com',
      pass: 'tu-app-password'
    }
  });
  const info = await transporter.sendMail({ from: '"SebaBiblio" <tu.email@gmail.com>', to, subject, text });
  return info;
}

module.exports = { sendEmail };
