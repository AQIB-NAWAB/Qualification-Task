import axios from "axios";
import config from "../config/config";
import logger from "./logger";

export const getAccessToken = async (): Promise<string> => {
    try {

        if (!config.badgr.email || !config.badgr.password) {
            throw new Error('Badgr email and password are required');
          }


      const params = new URLSearchParams();
      params.append('username', config.badgr.email);
      params.append('password', config.badgr.password);
      
      console.log(config.badgr);
      
      const response = await axios.post(`${config.badgr.endpoint}/o/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data.access_token;
    } catch (error: any) {
      logger.error('Error fetching access token:', error.message);
      throw error;
    }
  };