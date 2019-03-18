'use strict';

const detectTextIntent = require('../lib/detectTextIntent');
const processDialogflowActions = require('../listeners/processActions');

const { DIALOGFLOW_PROJECT_ID } = process.env;

/**
 * Sets up intent listeners and receives queries from ChatFuel.
 * 
 * @param {Object} request
 * @param {Object} response
 */
const setupIntentsListener = async (request, response) => {
  // Get our users query from ChatFuel.
  const userQueryText = request.body['last user freeform input'];
  const userMessengerId = request.body['messenger user id'];
  const userFirstName = request.body['first name'];
  const userMedia = request.body['customer_media'];
  const userQuickReply = request.body['user quick reply'];
  let textToDetect = userQueryText && userQueryText.length ? userQueryText : userMedia;
  textToDetect = userQuickReply && userQuickReply.length ? userQuickReply: textToDetect;

  // Create the DialogFlow session.
  detectTextIntent(
    DIALOGFLOW_PROJECT_ID,
    `user-${userMessengerId}`,
    [textToDetect],
    'en-US',
    ({
      parameters,
      outputContexts,
      result
    }) => {
      return processDialogflowActions({
        parameters,
        result,
        outputContexts,
        userFirstName,
        userQueryText,
        userMedia,
        userQuickReply,
        response
      });
    }
  );
};

module.exports = setupIntentsListener;