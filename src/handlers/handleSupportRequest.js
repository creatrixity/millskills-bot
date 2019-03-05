'use strict';
const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');
const { sendSupportNotification } = require('../lib/mailer');
const { SUPPORT_MAIL_ADDRESS } = process.env;

const handleSupportRequest = ({ userFirstName, response }) => {
  return response.send(createTextMessage([
    { text: `Hey ${userFirstName} — we will do our best to help you as soon as possible?`},
    { text: `What is the issue/concern you'd like our support team to help with?` }
  ]));
};

const handleSupportRequestFollowup = ({ userFirstName, response }) => {
  return response.send(createTextMessage([
    { text: `Ok we can definitely help with that ${userFirstName}!... What is the contact e-mail we have on file for you?` }
  ]));
};

const handleCustomerContactEmail = ({
  userFirstName,
  response
}) => {
    return response.send(createTextMessage([
      { text: `Thank you, ${userFirstName}. Do you have any screenshots that could help us assist you faster?
              Please reply with a "yes" or a "no".`
      }
    ]));
};

const handleCustomerMediaVolunteeringStatus = ({
  parameters,
  userFirstName,
  response
}) => {
    const {
      customer_email,
      complaint,
      isVolunteering
    } = JSON.parse(parameters);

    if (isVolunteering === 'no') {
      let message = `Ok thanks, ${userFirstName}... Our support team has been notified, keep an eye on your inbox from ${SUPPORT_MAIL_ADDRESS}`;
      
      response.send(createTextMessage([
        { text: message }
      ]));

      sendSupportNotification({ customer_email, complaint, userFirstName });
    } else {
      return response.send({
        redirect_to_blocks: ['Will Volunteer Media']
      })  
    }
};

const handleCustomerMedia = ({
  parameters,
  userFirstName,
  userMedia,
  response
}) => {
    const {
      customer_email,
      complaint
    } = JSON.parse(parameters);

    let message = `Ok thanks, ${userFirstName}... Our support team has been notified, keep an eye on your inbox from ${SUPPORT_MAIL_ADDRESS}`;
    
    sendSupportNotification({ customer_email, complaint, userFirstName, userMedia });

    return response.send(createTextMessage([
      { text: message }
    ]));
};

const handleRefundRequest = ({ userFirstName, response }) => {
  return response.send(createTextMessage([
    { text: `No problem ${userFirstName}.`},
    { text: "To be eligible for refunds, your subscription must be less than 30 days old."},
    { text: "If you request a refund before the 30 day period has elapsed, remember to honor our guarantee and cancel the subscription."},
    { text: "With that in mind, for us to properly process your request, we'll ask a couple of questions."},
    { text: "What are the last 4 digits of the credit card (CC) you used?"},
  ]));
};

const handleCustomerCCDigits = ({ userFirstName, parameters, response }) => {
  const { ccdigits } = JSON.parse(parameters);

  sendSupportNotification(customer_email, complaint, userFirstName, userMedia);

  return response.send(createTextMessage([
    { text: `Got it, ${userFirstName}! Your last 4 CC digits are ${ccdigits}.`},
    { text: "Please give a reason for requesting a refund."},
  ]));
};

const handleCustomerRefundReason = ({ userFirstName, parameters, response }) => {
  const {
    ccdigits,
    complaints
  } = JSON.parse(parameters);

  return response.send(createTextMessage([
    {
      text: `Ok thanks, ${userFirstName}... Your request will be processed soon.`
    },
  ]));
};

module.exports = { 
  handleSupportRequest,
  handleSupportRequestFollowup,
  handleCustomerContactEmail,
  handleCustomerMediaVolunteeringStatus,
  handleCustomerMedia,
  handleRefundRequest,
  handleCustomerCCDigits,
  handleCustomerRefundReason
};