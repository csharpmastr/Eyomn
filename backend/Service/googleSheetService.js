const { google } = require('googleapis');
require('dotenv').config()

const privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY is not set in the environment variables');
}

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
});

const sheet = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

async function appendToSheet(data) {
    const values = [Object.values(data)];
    const range = 'Sheet1';
    const valueInputOption = 'USER_ENTERED';
    const resource = { values };

    try {
        const response = await sheet.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
            insertDataOption: 'INSERT_ROWS'
        });
        return response.data;
    } catch (error) {
        console.error('Error writing to sheet:', error);
        throw error;
    }
}

module.exports = { appendToSheet };
