'use strict';

const {
  MAIL_SENDER_ADDRESS,
  MAIL_SENDER_PASSWORD,
  SUPPORT_MAIL_ADDRESS
} = process.env;

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const sendSupportNotification = (email, complaint, name, media) => {
  ejs.renderFile(path.join(__dirname, '../templates/mail/supportNotificationMail.ejs'), {
    complaint,
    email,
    name,
    media
  }, function (err, html) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAIL_SENDER_ADDRESS,
        pass: MAIL_SENDER_PASSWORD
      }
    });
  
    const mailOptions = {
      from: MAIL_SENDER_ADDRESS, // sender address
      to: SUPPORT_MAIL_ADDRESS, // list of receivers
      subject: `Chatbot Support Request from ${name}`, // Subject line
      html  // plain text body
    };
    
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });  
  })
}

module.exports = {
  sendSupportNotification
};