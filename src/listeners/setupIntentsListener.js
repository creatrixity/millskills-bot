'use strict';
const processAction = require('./processActions');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

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

  // Generate a unique session id.
  const sessionId = uuid.v4();

  // Create the DialogFlow session.
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(DIALOGFLOW_PROJECT_ID, sessionId);

  // The user query request dialogflow object.
  const dialogflowRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: userQueryText,
        languageCode: 'en-US'
      }
    }
  }

  const dialogflowResponses= await sessionClient.detectIntent(dialogflowRequest);
  const { queryResult } = dialogflowResponses[0];
  const { parameters, action } = queryResult;

  // console.log(queryResult);
  console.log(queryResult.parameters.fields.course.stringValue)
  return processAction(action, parameters.fields, response);

  // return response.send({
  //   "messages": [
  //     {
  //       "text": "Here's a potato."
  //     }
  //   ]
  // });
};

module.exports = setupIntentsListener;