const fetch = require('node-fetch');
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
          fulfillmentText:  `I'm sorry. We currently don't have any resources for ${course}.`
        });
      }
      
      // Build messages collection for relay as fulfillment messages.
      const messages = items.map(item => {
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
          "card": {
            "buttons": [
              {
                "postback": "Card Link URL or text",
                "text": "Card Link Title"
              }
            ],
            "imageUri": "http://urltoimage.com",
            "subtitle": "Card Subtitle",
            "title": "Card Title",
          }
        }
      });

      return cloudFNResponse.send({
        fulfillmentText: `We found ${items.length} resource${items.length > 1 && 's'}.`,
        fulfillmentMessages: [
          {
            "card": {
              "title": "Card Title",
              "subtitle": "Card subtitle",
              "imageUri": "https://github.com/fluidicon.png",
              "buttons": [
                {
                  "text": "Go to Google",
                  "postback": "www.google.com"
                },
                {
                  "text": "Go to Dialogflow",
                  "postback": "www.dialogflow.com"
                },
                {
                  "text": "Go to Slack",
                  "postback": "www.slack.com"
                }
              ]
            },
            "platform": "FACEBOOK"
          },
          {
            "text": {
              "text": [
                ""
              ]
            }
          }]
      });
    });
}

module.exports = getCourseInformation;