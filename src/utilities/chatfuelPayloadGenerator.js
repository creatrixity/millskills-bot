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
const createGallery = ({ cards, text }) => {
  let messages = [
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
  ];

  if (text && text.length) messages.push({ text })

  return JSON.stringify({
    messages
  })
}

module.exports = {
  createTextMessage,
  createGallery
};