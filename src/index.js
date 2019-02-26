'use strict';

const bodyParser = require('body-parser');
const env = require('dotenv');
const express = require('express');
const app = express();

// Load environmental variables.
env.config({ path: 'variables.env' });

// Initialize express middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup endpoints.
app.get('/', require('./listeners/verifyWebhook'));
app.post('/', require('./listeners/processActions'));

// Listen for requests.
app.listen(5000, () => console.log('Express server is listening on port 5000'))
