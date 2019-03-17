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
app.get('/processCrawlerActions', require('./listeners/processCrawlerActions'));

// Listen for requests.
app.listen(PORT, () => console.log(`Express server is listening on port ${PORT}`))
