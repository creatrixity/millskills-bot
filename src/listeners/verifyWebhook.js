'use strict';

const { WEBHOOK_VERIFICATION_TOKEN } = process.env;

/**
 * Sends a success response that verifies the status of our server.
 * 
 * @param {Object} request
 * @param {Object} response
 */
const verifyWebhook = (request, response) => {
  const { query } = request;

  const challenge = query['hub.challenge'];
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];

  if (mode && token === WEBHOOK_VERIFICATION_TOKEN) {
    response.status(200).send(challenge);
  } else {
    response.sendStatus(403);
  }
};

module.exports = verifyWebhook;