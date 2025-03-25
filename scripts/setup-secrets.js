const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

function setSecrets() {
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(
    /\n/g,
    "\\n"
  );
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const BADGR_EMAIL = process.env.BADGR_EMAIL;
  const BADGR_PASSWORD = process.env.BADGR_PASSWORD;
  const BADGR_ISSUER_ID = process.env.BADGR_ISSUER_ID;
  const BADGR_BADGE_ID = process.env.BADGR_BADGE_ID;


  if (
    !GOOGLE_CLIENT_EMAIL ||
    !GOOGLE_PRIVATE_KEY ||
    !GOOGLE_SHEET_ID ||
    !BADGR_EMAIL ||
    !BADGR_PASSWORD ||
    !BADGR_ISSUER_ID ||
    !BADGR_BADGE_ID
  ) {
    console.error(
      "❌ Missing secrets. Please make sure you have GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, BADGR_EMAIL, BADGR_PASSWORD, BADGR_ISSUER_ID, BADGR_BADGE_ID in your .env file"
    );
    return;
  }

  const workersDir = path.join(__dirname, "../workers");
  const folders = fs
    .readdirSync(workersDir)
    .filter((folder) =>
      fs.statSync(path.join(workersDir, folder)).isDirectory()
    );

  folders.forEach((folder) => {
    const workerPath = path.join(workersDir, folder);
    const devVarsFile = path.join(workerPath, ".dev.vars");

    console.log(
      `---------Process Running for the worker ${folder}-------------`
    );

    try {
      console.log(`✅ Setting secrets for ${folder}`);
      // Setting secrets using Wrangler
      execSync(
        `echo ${GOOGLE_CLIENT_EMAIL} | wrangler secret put GOOGLE_CLIENT_EMAIL --name ${folder}`
      );
      execSync(
        `echo "${GOOGLE_PRIVATE_KEY}" | wrangler secret put GOOGLE_PRIVATE_KEY --name ${folder}`
      );
      execSync(
        `echo ${GOOGLE_SHEET_ID} | wrangler secret put GOOGLE_SHEET_ID --name ${folder}`
      );
      execSync(
        `echo ${BADGR_EMAIL} | wrangler secret put BADGR_EMAIL --name ${folder}`
      );
      execSync(
        `echo ${BADGR_PASSWORD} | wrangler secret put BADGR_PASSWORD --name ${folder}`
      );
      execSync(
        `echo ${BADGR_ISSUER_ID} | wrangler secret put BADGR_ISSUER_ID --name ${folder}`
      );
      execSync(
        `echo ${BADGR_BADGE_ID} | wrangler secret put BADGR_BADGE_ID --name ${folder}`
      );

      console.log(`✅ Secrets set for ${folder}`);

      console.log(`✅ Creating the .dev.vars file for ${folder}`);
      // Creating the .dev.vars file
      const devVarsContent = `GOOGLE_CLIENT_EMAIL="${GOOGLE_CLIENT_EMAIL}"\nGOOGLE_PRIVATE_KEY="${GOOGLE_PRIVATE_KEY}"\nGOOGLE_SHEET_ID="${GOOGLE_SHEET_ID}"\nBADGR_EMAIL="${BADGR_EMAIL}"\nBADGR_PASSWORD="${BADGR_PASSWORD}"\nBADGR_ISSUER_ID="${BADGR_ISSUER_ID}"\nBADGR_BADGE_ID="${BADGR_BADGE_ID}"\n`;
      fs.writeFileSync(devVarsFile, devVarsContent);

      console.log(`✅ .dev.vars file created for ${folder}`);
      console.log(`✅ Secrets set and .dev.vars file created for ${folder}`);
      console.log(
        `-------------------------------------------------------------`
      );
    } catch (error) {
      console.error(
        `❌ Failed to set secrets or create .dev.vars for ${folder}:`,
        error
      );
    }
  });

  console.log(
    "✅ All secrets have been set and .dev.vars files created successfully!"
  );
}

setSecrets();
