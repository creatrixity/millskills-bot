'use strict';
const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');
const { sendSupportNotification } = require('../lib/mailer');

const handleSupportRequest = (userFirstName, cloudFNResponse) => {
  return cloudFNResponse.send(createTextMessage([
    { text: `Hey ${userFirstName} — we will do our best to help you as soon as possible?`},
    { text: `What is the issue/concern you'd like our support team to help with?` }
  ]));
};

const handleSupportRequestFollowup = (userFirstName, cloudFNResponse) => {
  return cloudFNResponse.send(createTextMessage([
    { text: `Ok we can definitely help with that ${userFirstName}!... What is the contact e-mail we have on file for you?` }
  ]));
};

const handleCustomerContactEmail = (
  parameters,
  userFirstName,
  cloudFNResponse
  ) => {
    const {
      customer_email,
      complaint
    } = JSON.parse(parameters);

    return cloudFNResponse.send(createTextMessage([
      { text: `Thank you, ${userFirstName}. Do you have any screenshots that could help us assist you faster?
              Please reply with a "yes" or a "no".`
      }
    ]));
};

const handleCustomerMediaVolunteeringStatus = (
  parameters,
  userFirstName,
  cloudFNResponse
  ) => {
    const {
      customer_email,
      complaint,
      isVolunteering
    } = JSON.parse(parameters);

    if (isVolunteering === 'no') {
      let message = `Ok thanks, ${userFirstName}... Our support team has been notified, keep an eye on your inbox from support@millskills.co`;
      
      cloudFNResponse.send(createTextMessage([
        { text: message }
      ]));

      sendSupportNotification(customer_email, complaint, userFirstName);
    } else {
      return cloudFNResponse.send({
        redirect_to_blocks: ['Will Volunteer Media']
      })  
    }
};

const handleCustomerMedia = (
  parameters,
  userFirstName,
  userMedia,
  cloudFNResponse
  ) => {
    const {
      customer_email,
      complaint
    } = JSON.parse(parameters);

    let message = `Ok thanks, ${userFirstName}... Our support team has been notified, keep an eye on your inbox from support@millskills.co`;
    
    sendSupportNotification(customer_email, complaint, userFirstName, userMedia);

    return cloudFNResponse.send(createTextMessage([
      { text: message }
    ]));

};

module.exports = { 
  handleSupportRequest,
  handleSupportRequestFollowup,
  handleCustomerContactEmail,
  handleCustomerMediaVolunteeringStatus,
  handleCustomerMedia
};