'use strict';

const structjson = require('./structjson');

/**
 * Records the query request.
 * 
 * @param {Object} sessionClient 
 * @param {Object} result 
 */
function logQueryRequest(sessionClient, result, callback) {
  // Require the SDK.
  const dialogflow = require('dialogflow');

  // Instantiates a context client,
  const contextClient = new dialogflow.ContextsClient();

  let outputContexts = [];

  const parameters = JSON.stringify(structjson.structProtoToJson(result.parameters));

  if (result.outputContexts && result.outputContexts.length) {
    outputContexts = result.outputContexts.map(context => {
      const contextId = contextClient.matchContextFromContextName(context.name);
      const contextParameters = JSON.stringify(structjson.structProtoToJson(context.parameters))

      return {
        id: contextId,
        parameters: contextParameters
      }
    });
  };

  return callback({
    result,
    parameters,
    outputContexts
  });

}

module.exports = logQueryRequest;