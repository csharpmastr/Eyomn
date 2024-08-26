const { google } = require("googleapis");
require("dotenv").config();

// Decode the Base64 encoded service account JSON
const base64EncodedServiceAccount = process.env.BASE64_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf-8");
const credentials = JSON.parse(decodedServiceAccount);

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheet = google.sheets({ version: "v4", auth });

async function appendToSheet(data) {
  const values = [Object.values(data)];
  const range = "Sheet1";
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const response = await sheet.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption,
      resource,
      insertDataOption: "INSERT_ROWS",
    });
    return response.data;
  } catch (error) {
    console.error("Error writing to sheet:", error);
    throw error;
  }
}

module.exports = { appendToSheet };
