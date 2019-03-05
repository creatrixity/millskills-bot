var secret = "uchiha-uzumaki-san";
var repo = "/root/millskills-bot/";

let http = require('http');
let crypto = require('crypto');

const exec = require('child_process').exec;

http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            exec('cd ' + repo + ' && git pull');
            exec('npm install')
            exec('pm2 restart index')
        }
    });

    res.end();
}).listen(8080);
