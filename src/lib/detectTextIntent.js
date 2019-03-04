'use strict';

const logQueryRequest = require('./logQueryRequest');
const structjson = require('./structjson');

/**
 * Detects the intent for any given number of queries.
 * 
 * @param {String} projectId - ID of the Google project containing agent.
 * @param {String} sessionId - Dialogflow session id.
 * @param {Array<String>} queries - List of queries to be processed.
 * @param {String} languageCode - Language for agent.
 */
function detectTextIntent(projectId, sessionId, queries, languageCode, callback) {
  // Require the Dialogflow Node SDK
  const dialogflow = require('dialogflow');

  // Instantiate a session client.
  const sessionClient = new dialogflow.SessionsClient()

  if (!queries || !queries.length) return;

  // Generate the path that maps ownership of agent to intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Define a promise object to store yet to be created a promise.
  let promise;

  // Go through each query and detect their intent.
  for (const query of queries) {
    // Create the request payload object.
    const queryRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          languageCode,
          text: query
        }
      }
    };

    // If we don't have a promise object defined, we just detect the query intent.
    // Otherwise, we ensure all proper context information is passed along.
    if (!promise) {
      promise = sessionClient.detectIntent(queryRequest);
    } else {
      promise = promise.then(responses => {
        // Obtain the query result from the response object.
        const response = responses[0];
        const { queryResult } = response

        logQueryRequest(sessionClient, queryResult, callback);

        // Go through each context and clean their parameters.
        queryResult.outputContexts.forEach(context => {
          // There is a bug in gRPC that the returned google.protobuf.Struct
          // value contains fields with value of null, which causes error
          // when encoding it back. Converting to JSON and back to proto
          // removes those values.
          context.parameters = structjson.jsonToStructProto(
            structjson.structProtoToJson(context.parameters)
          );
        });

        // Update the query parameters with the clean data.
        queryRequest.queryParams = {
          contexts: queryResult.outputContexts
        }

        // Finally, with the updated request parameters, detect the intent.
        return sessionClient.detectIntent(queryRequest);
      });
    }
  }

  // Resolve the promise and record the results of the query made. 
  return promise
    .then(responses => {
      logQueryRequest(sessionClient, responses[0].queryResult, callback);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

module.exports = detectTextIntent;