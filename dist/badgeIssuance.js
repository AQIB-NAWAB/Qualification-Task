"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.issueBadge = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const issueBadge = async (studentData, accessToken) => {
    try {
        const { email } = studentData;
        console.log(email);
        const url = `${config_1.default.badgr.endpoint}/v2/issuers/${config_1.default.badgr.issuerId}/assertions`;
        const response = await axios_1.default.post(url, {
            recipient: {
                identity: email,
                type: "email",
                hashed: false
            },
            badgeclass: config_1.default.badgr.badgeId,
            issuer: config_1.default.badgr.issuerId,
            notify: true
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        // const badgeId = response.data.result.id; // Extract issued badge ID
        const badgeUrl = response.data.result[0].openBadgeId;
        console.log(`✅ Badge issued for ${email}: ${badgeUrl}`);
        logger_1.default.info(`Badge issued for ${studentData.email}`);
        return response.data.result;
    }
    catch (error) {
        logger_1.default.error(`Error issuing badge for ${studentData.email}:`, error.message);
        throw error;
    }
};
exports.issueBadge = issueBadge;
const getAccessToken = async () => {
    try {
        if (!config_1.default.badgr.email || !config_1.default.badgr.password) {
            throw new Error('Badgr email and password are required');
        }
        const params = new URLSearchParams();
        params.append('username', config_1.default.badgr.email);
        params.append('password', config_1.default.badgr.password);
        console.log(config_1.default.badgr);
        const response = await axios_1.default.post(`${config_1.default.badgr.endpoint}/o/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    }
    catch (error) {
        logger_1.default.error('Error fetching access token:', error.message);
        throw error;
    }
};
exports.getAccessToken = getAccessToken;
