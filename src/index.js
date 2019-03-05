'use strict';

const bodyParser = require('body-parser');
const env = require('dotenv');
const express = require('express');
const app = express();

const PORT = process.env.port || 5001;

// Load environmental variables.
env.config({ path: 'variables.env' });

// Initialize express middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup endpoints.
app.post('/', require('./listeners/setupIntentsListener'));
app.post('/webhook-listener', require('./listeners/processWebhookCall'));
app.get('/sendMail', function () {
  const { sendSupportNotification } = require('./lib/mailer');

  sendSupportNotification({ email: 'fred@example.com', complaint: 'I hate tea', name: 'Fred' });
});

// Listen for requests.
app.listen(PORT, () => console.log(`Express server is listening on port ${PORT}`))
