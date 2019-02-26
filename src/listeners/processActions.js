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
const processDialogflowAction = (request, response) => {
  const { action, parameters } = request.body.queryResult;

  // Set response headers.
  response.setHeader('Content-Type', 'application/json');

  // Extract parameters from the query.
  const { course } = parameters;

  const actionsMap = {
    'input.getCourseInformation': {
      handler: getCourseInfo,
      arguments: [course, response, action]
    }
  }

  // Handle invalid actions.
  if (!actionsMap[action]) {
    return response.send('Sorry, I had a little trouble with your question.');
  }

  const actionObject = actionsMap[action];

  return actionObject.handler.apply(this, actionObject.arguments);
};


module.exports = processDialogflowAction;