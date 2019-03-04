'use strict';

/**
 * Creates a text message.
 * 
 * @param {String|Array<Object>} payload
 * @returns {String<JSON>}
 */
const createTextMessage = (payload) => {
  const messages = typeof payload === 'string' ? [{ text: payload }] : payload;

  return JSON.stringify({
    messages
  });
}

/**
 * Creates a gallery comprising of multiple cards.
 * 
 * @param {Array<Object>} cards 
 * @returns {String<JSON>}
 */
const createGallery = ({ cards }) => {
  return JSON.stringify({
    messages: [
      {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            image_aspect_ratio: "square",
            elements: cards
          }
        }
      },
    ]
  })
}

module.exports = {
  createTextMessage,
  createGallery
};