'use strict';

const bodyParser = require('body-parser');
const env = require('dotenv');
const express = require('express');
const app = express();

const PORT = process.env.port || 5001;

// Load environmental variables.
env.config({ path: 'variables.env' });

const { setupJWTAuth, appendSheetRow } = require('./lib/setupGoogleSheets')

// Initialize express middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup endpoints.
app.post('/', require('./listeners/setupIntentsListener'));
app.post('/webhook-listener', require('./listeners/processWebhookCall'));
app.get('/logToSheet', function () {
  let jwtAuthClient = setupJWTAuth();

  appendSheetRow(jwtAuthClient, [
    [new Date().toUTCString(), 'Johnny Appleseed', 'I like trees', '4444']],
    'Sheet1!A1:D1',
    process.env.SUPPORT_LOGS_REFUNDS_SHEET_ID
  )

});

// Listen for requests.
app.listen(PORT, () => console.log(`Express server is listening on port ${PORT}`))
