'use strict';

/**
 * Creates a gallery comprising of multiple cards.
 * 
 * @param {Array<Object>} cards 
 * @returns {Object}
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
  createGallery
};