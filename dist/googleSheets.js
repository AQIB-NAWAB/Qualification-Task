"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSheetData = exports.getSheetData = void 0;
const googleapis_1 = require("googleapis");
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const axios_1 = __importDefault(require("axios"));
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: {
        client_email: config_1.default.google.googleClientEmail,
        private_key: config_1.default.google.googlePrivateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
// Function to fetch data from Sheet1.
const URL = "https://script.google.com/macros/s/AKfycbyiwK_dQ3-v8OjCiJ8QEovFAfHCNUODX6x07QA5VQEKjr1GS2zkqHhW_oV3lCy-KT89/exec";
const getSheetData = async () => {
    try {
        const response = await axios_1.default.get(URL);
        logger_1.default.info('Fetched data from Google Sheets successfully.');
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        logger_1.default.error('Error fetching data from Google Sheets:', error.message);
        throw error;
    }
};
exports.getSheetData = getSheetData;
// Function to update data in a given range.
const updateSheetData = async (range, values) => {
    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: config_1.default.google.sheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: { values },
        });
        logger_1.default.info('Updated Google Sheets data successfully.');
        return response.data;
    }
    catch (error) {
        logger_1.default.error('Error updating Google Sheets data:', error.message);
        throw error;
    }
};
exports.updateSheetData = updateSheetData;
