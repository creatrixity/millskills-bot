'use strict';

const {
  MAIL_SENDER_ADDRESS,
  MAIL_SENDER_PASSWORD,
  SUPPORT_MAIL_ADDRESS
} = process.env;

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const sendMail = ({
  templatePath,
  templateParams,
  subject
}) => {
  ejs.renderFile(path.join(__dirname, templatePath), templateParams, function (err, html) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_SENDER_ADDRESS,
        pass: MAIL_SENDER_PASSWORD
      }
    });
  
    const mailOptions = {
      subject, // Subject line
      html,  // plain text body
      from: MAIL_SENDER_ADDRESS, // sender address
      to: SUPPORT_MAIL_ADDRESS, // list of receivers
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });
  });
};

const sendSupportNotification = ({ email, complaint, name, media }) => {
  return sendMail({
    templatePath: '../templates/mail/supportNotificationMail.ejs',
    templateParams: {
      complaint,
      email,
      name,
      media  
    },
    subject: `Chatbot Support: Aid Request from ${name}`
  });
}

const sendRefundRequestNotification = ({ ccdigits, reason, name, customerRefundEmail }) => {
  return sendMail({
    templatePath: '../templates/mail/refundRequestMail.ejs',
    templateParams: {
      reason,
      ccdigits,
      name,
      customerRefundEmail
    },
    subject: `Chatbot Support: Refund Request from ${name}`
  });
}

module.exports = {
  sendSupportNotification,
  sendRefundRequestNotification
};