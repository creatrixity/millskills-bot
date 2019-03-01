'use strict';

const getCourseInfo = require('../handlers/getCourseInformation');

/**
 * Processes all dialog flow actions coming into the webhook.
 * 
 * @param {Object} request
 * @param {Object} response
 * 
 * @returns {Object<response>|Function}
 */
const processDialogflowAction = (action, fields, response) => {

  // Set response headers.
  response.setHeader('Content-Type', 'application/json');

  // Extract parameters from the query.
  const { course } = fields;

  const actionsMap = {
    'input.getCourseInformation': {
      handler: getCourseInfo,
      arguments: [course.stringValue, response, action]
    }
  }

  // Handle invalid actions.
  if (!actionsMap[action]) {
    return response.send({ messages: [
        {text: 'Sorry, I had a little trouble with your question.'}
      ] 
    });
  }

  const actionObject = actionsMap[action];

  return actionObject.handler.apply(this, actionObject.arguments);
};


module.exports = processDialogflowAction;