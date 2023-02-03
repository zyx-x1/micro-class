const nodemailer = require('nodemailer');
const mailSender = `x75046@qq.com`;
const mailSmtpcode = `utwcphtdkugbbcdj`;

exports.transport = nodemailer.createTransport({
  host: 'smtp.qq.com',
  secureConnection: true,
  port: 465,
  secure: true,
  auth: {
    user: mailSender,
    pass: mailSmtpcode
  }
})