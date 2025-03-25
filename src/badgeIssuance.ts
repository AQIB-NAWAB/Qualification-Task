import axios from "axios";
import config from "./config/config";
import logger from "./utils/logger";

export interface StudentData {
  email: string;
  name: string;
  isAssigned: boolean;
  rowIndex: number;
}

const CF_ID = config.cloudflare?.id;
if (!CF_ID) {
  throw new Error("Cloudflare ID is missing in config");
}

const URL = `https://assign-badge.${CF_ID}.workers.dev/`;

export const issueBadge = async (studentData: StudentData, accessToken: string) => {
  try {
    const response = await axios.post(
      URL,
      { studentData, accessToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    logger.error("Error while issuing badge:", error ||  error?.response?.data || error.message);
    return null;
  }
};
