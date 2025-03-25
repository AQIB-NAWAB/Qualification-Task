import cron from "node-cron";
import { getSheetData } from "./googleSheets";
import { issueBadge, StudentData } from "./badgeIssuance";
import { getAccessToken } from "./utils/generateToken";
import logger from "./utils/logger";

const processCertificates = async (): Promise<void> => {
  try {
    const sheetData = await getSheetData();

    if (!sheetData || sheetData.length === 0) {
      logger.info("No data found in the Google Sheet.");
      return;
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      logger.error("Failed to get access token.");
      return;
    }

    console.log(accessToken);

    //  now calling the cloudflare workers to issue the badge

    for (const student of sheetData) {
      const studentData: StudentData = {
        name: student.name,
        email: student.email,
        rowIndex: student.rowIndex,
        isAssigned: student.isAssigned,
      };

      await issueBadge(studentData, accessToken);
    }

    console.log("Certificates assigned  successfully.");

    return;
  } catch (error: any) {
    logger.error(`Failed to process certificates: ${error}`);
  }
};

function CRON_JOBS() {
  // Schedule the task using node-cron.
  // This example schedules the task to run daily at midnight (UTC).
  cron.schedule("37 0 * * *", async () => {
    logger.info("Scheduled task started: Processing certificates.");
    await processCertificates();
    logger.info("Scheduled task finished: Certificates processing completed.");
  });

  // Optionally, run once immediately for testing.
  processCertificates();
}

export default CRON_JOBS;
