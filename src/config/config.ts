import dotenv from "dotenv";
dotenv.config({ path: '.env' });

interface Config {
  google: {
    sheetId: string | undefined;
    googleClientEmail?: string;
    googlePrivateKey?: string;
  };
  badgr: {
    endpoint: string;
    email?: string;
    password?: string;
    issuerId?: string;
    badgeId?: string;
  };
  logging: {
    level: string;
  };
  cloudflare:{
    id: string;
  }
}

const config: Config = {
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
  },
  cloudflare:{
    id: process.env.CLOUDFLARE_ID || ''
  }
};

export default config;
