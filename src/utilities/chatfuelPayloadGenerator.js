'use strict';

/**
 * Creates a text message.
 * 
 * @param {String|Array<Object>} payload
 * @param {Array<String>} blocks
 * 
 * @returns {String<JSON>}
 */
const createTextMessage = (payload, blocks=[]) => {
  const messages = typeof payload === 'string' ? [{ text: payload }] : payload;

  return JSON.stringify({
    messages,
    redirect_blocks: blocks
  });
}

/**
 * Creates a gallery comprising of multiple cards.
 * 
 * @param {Array<Object>} cards 
 * @param {String} text
 * @param {Array<String>} redirectBlocks 
 * 
 * @returns {String<JSON>}
 */
const createGallery = ({ cards, text, redirectBlocks }) => {
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