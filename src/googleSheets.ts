import { StudentData } from "./badgeIssuance";
import config from "./config/config";
import logger from "./utils/logger";
import axios from "axios";

const URL = `https://get-assigned-users.${config.cloudflare.id}.workers.dev/`;

export const getSheetData = async (): Promise<StudentData[]> => {
  try {
    const response = await axios.get(URL);

    logger.info("Fetched data from Google Sheets successfully.");

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    logger.error("Error fetching data from Google Sheets:", error.message);
    throw error;
  }
};
