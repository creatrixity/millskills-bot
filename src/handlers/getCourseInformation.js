const fetch = require('node-fetch');
const { createGallery } = require('../utilities/chatfuelPayloadGenerator');
const {
  YOUTUBE_CHANNEL_ID,
  YOUTUBE_API_KEY
} = process.env;

/**
 * Fetches resources on a provided course.
 * 
 * @param {Object} course 
 * @param {Function} cloudFNResponse 
 */
function getCourseInformation (course, cloudFNResponse){
  // Build the request query URI.
  const queryHost = 'https://www.googleapis.com/youtube/v3/search';
  const queryString = course.trim().replace(/\s+/, '+');
  const queryRequestURL = `${queryHost}?channelId=${YOUTUBE_CHANNEL_ID}&q=${queryString}&type=video&part=snippet&key=${YOUTUBE_API_KEY}`;

  return fetch(queryRequestURL)
    .then(res => res.json())
    .then(parsedData => {
      const { items } = parsedData;
      
      if (!items.length) {
        return cloudFNResponse.send({
          messages: [
            {text: `I'm sorry. We currently don't have any resources for ${course}.`}
          ]
        });
      }
      
      // Build messages collection for relay as fulfillment messages.
      const cards = items.map(item => {
        const {
          snippet,
          id
        } = item;

        const {
          description,
          thumbnails,
          title
        } = snippet;

        return {
          title,
          "subtitle": description,
          "image_url": thumbnails.high.url,
          "buttons": [
            {
              "type": "web_url",
              "title": `Watch this video`,
              "url": `https://youtube.com/watch?v=${id.videoId}`
            }
          ]
        }
      });

      return cloudFNResponse.send(createGallery({ cards }));
    });
}

module.exports = getCourseInformation;