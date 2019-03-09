'use strict';

const childProcess = require('child_process');
const githubUsername = 'creatrixity';

function deploy (res, commits) {
  childProcess.exec('cd /root/millskills-bot && ./post-deploy-actions.sh', function(err, stdout, stderr){
    if (err) {
     console.error(err);
     return res.sendStatus(500);
    }
    
    res.sendStatus(200);
  });

  if (commits[0].modified.indexOf('package.json') > -1) {
    childProcess.exec('npm install', function(err, stdout, stderr){
      if (err) {
       console.log('Failed to install package');
       console.error(err);
       return res.sendStatus(500);
      }
      
      res.sendStatus(200);
    });  
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function processWebhookCall (req, res) {
  const {
    commits,
    sender,
    ref
  } = req.body;

  if (ref.indexOf('master') > -1 && sender.login === githubUsername) {
    deploy(res, commits);
  }
}

module.exports = processWebhookCall;