const { google } = require("googleapis");
require("dotenv").config();

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

const getSheetData = async () => {
  try {
    const response = await sheet.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A!:C",
    });
    return response.data.values || [];
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
};
const emailExists = async (email) => {
  try {
    const data = await getSheetData();
    const emailColumnIndex = 2;
    const emailFound = data.some((row) => row[emailColumnIndex] === email);
    return emailFound;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};

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

module.exports = { appendToSheet, emailExists, getSheetData };
