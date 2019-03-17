'use strict';

const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');
const getCourseInfo = require('../handlers/getCourseInformation');
const {
  handleSupportRequest,
  handleSupportRequestFollowup,
  handleCustomerContactEmail,
  handleCustomerMediaVolunteeringStatus,
  handleCustomerMedia,
  handleRefundRequest,
  handleCustomerCCDigits,
  handleCustomerRefundReason
} = require('../handlers/handleSupportRequest');

const { handleBookSnippetRetrieval } = require('../handlers/handleBookActions');

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
    'input.getCourseInformation': getCourseInfo,
    'input.initSupportRequest': handleSupportRequest,
    'input.getComplaint': handleSupportRequestFollowup,
    'input.getCustomerContactMail': handleCustomerContactEmail,
    'input.getCustomerMediaVolunteeringStatus': handleCustomerMediaVolunteeringStatus,
    'input.getCustomerMedia': handleCustomerMedia,
    'input.initRefundRequest': handleRefundRequest,
    'input.getCustomerCCDigits': handleCustomerCCDigits,
    'input.getCustomerRefundReason': handleCustomerRefundReason,
    'input.getBookSnippet': handleBookSnippetRetrieval
  }

  // Handle invalid actions.
  if (!action.length || !actionsMap.hasOwnProperty(action)) {
    return response.send(createTextMessage('Sorry, I had a little trouble with your question.'));
  } else {
    const actionObject = actionsMap[action];

    return actionObject.apply(this, [{ parameters, userFirstName, userMedia, response }]);  
  }
};


module.exports = processDialogflowAction;