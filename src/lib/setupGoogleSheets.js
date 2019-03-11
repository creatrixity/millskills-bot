const { google } = require('googleapis');
const {
  SUPPORT_LOGS_PRIVATE_KEY,
  SUPPORT_LOGS_CLIENT_EMAIL,
  SUPPORT_LOGS_SUPPORT_SHEET_ID
} = process.env;

function setupJWTAuth () {
  const jwtClient = new google.auth.JWT(
    SUPPORT_LOGS_CLIENT_EMAIL,
    null,
    SUPPORT_LOGS_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully authenticated Google Sheets');
      return;
    }
  });

  return jwtClient
}

function appendSheetRow (jwtClient, values, range='Sheet1!A1:D1', spreadsheetId=SUPPORT_LOGS_SUPPORT_SHEET_ID) {
  const sheets = google.sheets('v4')

  sheets.spreadsheets.values.append({
    auth: jwtClient,
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      range,
      majorDimension: "ROWS",
      values
    }
  }, function (err, response){
    if (err) {
      console.error(err);
      return;
    }
    return true
  })
}

module.exports = {
  appendSheetRow,
  setupJWTAuth
};