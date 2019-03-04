'use strict';

const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');
const getCourseInfo = require('../handlers/getCourseInformation');
const {
  handleSupportRequest,
  handleSupportRequestFollowup,
  handleCustomerContactEmail,
  handleCustomerMediaVolunteeringStatus,
  handleCustomerMedia,
} = require('../handlers/handleSupportRequest');

/**
 * Processes dialog flow actions coming into the webhook.
 * 
 * @param {String} action
 * @param {Object} fields
 * @param {String} userFirstName
 * @param {Object} response
 * 
 * @returns {Object<response>|Function}
 */
const processDialogflowAction = ({
  parameters,
  outputContexts,
  userQueryText,
  userFirstName,
  userMedia,
  result,
  response
}) => {
  const { action } = result;
  console.log({ result, userMedia, userQueryText });
  // Set response headers.
  response.setHeader('Content-Type', 'application/json');

  const actionsMap = {
    'input.getCourseInformation': {
      handler: getCourseInfo,
      arguments: [parameters, response]
    },

    'input.initSupportRequest': {
      handler: handleSupportRequest,
      arguments: [userFirstName, response]
    },

    'input.getComplaint': {
      handler: handleSupportRequestFollowup,
      arguments: [userFirstName, response]
    },

    'input.getCustomerContactMail': {
      handler:   handleCustomerContactEmail,
      arguments: [parameters, userFirstName, response]
    },

    'input.getCustomerMediaVolunteeringStatus': {
      handler:   handleCustomerMediaVolunteeringStatus,
      arguments: [parameters, userFirstName, response]
    },

    'input.getCustomerMedia': {
      handler:   handleCustomerMedia,
      arguments: [parameters, userFirstName, userMedia, response]
    },
  }

  // Handle invalid actions.
  if (!action.length || !actionsMap.hasOwnProperty(action)) {
    return response.send(createTextMessage('Sorry, I had a little trouble with your question.'));
  } else {
    const actionObject = actionsMap[action];

    return actionObject.handler.apply(this, actionObject.arguments);  
  }
};


module.exports = processDialogflowAction;