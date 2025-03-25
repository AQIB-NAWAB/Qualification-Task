"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCertificates = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const googleSheets_1 = require("./googleSheets");
const badgeIssuance_1 = require("./badgeIssuance");
const logger_1 = __importDefault(require("./utils/logger"));
const processCertificates = async () => {
    try {
        const sheetData = await (0, googleSheets_1.getSheetData)();
        if (!sheetData || sheetData.length === 0) {
            logger_1.default.info('No data found in the Google Sheet.');
            return;
        }
        const headers = sheetData[0];
        const dataRows = sheetData.slice(1);
        const accessToken = await (0, badgeIssuance_1.getAccessToken)();
        console.log(accessToken);
        console.log(sheetData);
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const studentData = headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
            }, {});
            if (studentData.email &&
                studentData.name) {
                try {
                    logger_1.default.info(`Processing student: ${studentData.email}`);
                    const response = await (0, badgeIssuance_1.issueBadge)(studentData, accessToken);
                    if (response) {
                        const certificateIssuedIndex = headers.indexOf('certificateIssued');
                        if (certificateIssuedIndex !== -1) {
                            row[certificateIssuedIndex] = 'true';
                        }
                        else {
                            row.push('true');
                            headers.push('certificateIssued');
                        }
                        const rowNumber = i + 2;
                        const range = `Sheet1!A${rowNumber}:Z${rowNumber}`;
                        await (0, googleSheets_1.updateSheetData)(range, [row]);
                        logger_1.default.info(`Certificate issued for student: ${studentData.email}`);
                    }
                    else {
                        logger_1.default.error(`Badge issuance failed for ${studentData.email}`);
                    }
                }
                catch (error) {
                    logger_1.default.error(`Error processing student ${studentData.email}: ${error.message}`);
                }
            }
        }
    }
    catch (error) {
        logger_1.default.error(`Failed to process certificates: ${error.message}`);
    }
};
exports.processCertificates = processCertificates;
// Schedule the task using node-cron.
// This example schedules the task to run daily at midnight (UTC).
node_cron_1.default.schedule('37 0 * * *', async () => {
    logger_1.default.info('Scheduled task started: Processing certificates.');
    await processCertificates();
    logger_1.default.info('Scheduled task finished: Certificates processing completed.');
});
// Optionally, run once immediately for testing.
processCertificates();
