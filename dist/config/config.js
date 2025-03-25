"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const config = {
    google: {
        sheetId: process.env.GOOGLE_SHEET_ID,
        googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
    },
    badgr: {
        endpoint: process.env.BADGR_ENDPOINT || 'https://api.badgr.io/v2/issuers/your-issuer/badgeclasses',
        email: process.env.BADGR_EMAIL,
        password: process.env.BADGR_PASSWORD,
        issuerId: process.env.BADGR_ISSUER_ID,
        badgeId: process.env.BADGR_BADGE_ID,
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};
exports.default = config;
