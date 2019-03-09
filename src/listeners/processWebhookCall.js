'use strict';

/**
 * Processing Github webhook calls.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
function processWebhookCall (req, res) {
  var secret = "uchiha-uzumaki-san";

  let crypto = require('crypto');

  const { execFile } = require('child_process');
  console.log('Received webhook call from Github');

  req.on('data', async function(chunk) {
    let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
      var execOptions = {
        maxBuffer: 1024 * 1024 // 1mb
      }

      // Exec a shell script
      await execFile('/root/millskills-bot/post-deploy-actions.sh', execOptions, function(error, stdout, stderr) {
        if (error) {
          console.error('stderr', stderr);
          throw error;
        }
        
        console.log('stdout', stdout);
      });

      console.log('Processing changes from webhook...');
    }
  })
}

module.exports = processWebhookCall;