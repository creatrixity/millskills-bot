'use strict';

const childProcess = require('child_process');
const githubUsername = 'creatrixity';

function deploy (res) {
  childProcess.exec('cd /root/millskills-bot && ./post-deploy-actions.sh', function(err, stdout, stderr){
    if (err) {
     console.error(err);
     return res.send(500);
    }
    
    res.send(200);
  });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function processWebhookCall (req, res) {
  const {
    sender,
    ref
  } = req.body;

  if (ref.indexOf('master') > -1 && sender.login === githubUsername) {
    deploy(res);
  }
}

module.exports = processWebhookCall;