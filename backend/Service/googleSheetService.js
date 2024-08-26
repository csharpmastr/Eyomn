const { google } = require("googleapis");
require("dotenv").config();

const privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("GOOGLE_PRIVATE_KEY is not set in the environment variables");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey.replace(/\\n/g, "\n"),
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
