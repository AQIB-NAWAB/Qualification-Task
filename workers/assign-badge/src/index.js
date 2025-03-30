import axios from 'axios';

export default {
	async fetch(request, env, ctx) {
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		try {
			const { studentData, accessToken } = await request.json();
			if (!studentData || !accessToken) {
				return new Response('Bad Request', { status: 400 });
			}

			const config = {
				GOOGLE_CLIENT_EMAIL: env.GOOGLE_CLIENT_EMAIL,
				GOOGLE_PRIVATE_KEY: env.GOOGLE_PRIVATE_KEY,
				GOOGLE_SHEET_ID: env.GOOGLE_SHEET_ID,
				BADGR_ENDPOINT: 'https://api.badgr.io',
				BADGR_ISSUER_ID: env.BADGR_ISSUER_ID,
				BADGR_BADGE_ID: env.BADGR_BADGE_ID
			};

			const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, BADGR_ENDPOINT, BADGR_ISSUER_ID, BADGR_BADGE_ID } = config;

			if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID || !BADGR_ISSUER_ID || !BADGR_BADGE_ID) {
				throw new Error('Missing required environment variables.');
			}

			const { email } = studentData;

			// Assign badge to user 
			const badgeUrl = await assignBadge(email, accessToken, BADGR_ENDPOINT, BADGR_ISSUER_ID, BADGR_BADGE_ID);

			// Get the Token
			const sheetsAccessToken = await getSheetAccessToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);

			// Update user status in Google Sheet
			await updateGoogleSheet(GOOGLE_SHEET_ID, sheetsAccessToken, email);

			return new Response(JSON.stringify({ badgeUrl }), {
				headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message, status: error.status }), {
				status: error.status || 500,
				headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
			});
		}
	},
};

// Assing Badge function to assign the badge 

async function assignBadge(email, accessToken, BADGR_ENDPOINT, BADGR_ISSUER_ID, BADGR_BADGE_ID) {
	const url = `${BADGR_ENDPOINT}/v2/issuers/${BADGR_ISSUER_ID}/assertions`;

	const response = await axios.post(
		url,
		{
			recipient: { identity: email, type: 'email', hashed: false },
			badgeclass: BADGR_BADGE_ID,
			issuer: BADGR_ISSUER_ID,
			notify: true,
		},
		{
			headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
		}
	);

	return response.data.result[0].openBadgeId;
}

// Get the access token for the google sheet

async function getSheetAccessToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) {
	const jwt = await createJWT(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);
	const response = await axios.post('https://oauth2.googleapis.com/token', {
		grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
		assertion: jwt,
	});
	return response.data.access_token;
}


// helper function to update the google sheet

async function updateGoogleSheet(GOOGLE_SHEET_ID, accessToken, email) {
	const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1!A:C?majorDimension=ROWS`;
	const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

	// Get sheet data
	const response = await axios.get(sheetUrl, { headers });
	const rows = response.data.values;

	// Find the target row using the row index
	let rowIndex = -1;
	rows.forEach((row, index) => {
		if (row[0] === email) {
			rowIndex = index + 1; 
		}
	});

	if (rowIndex === -1) throw new Error('Email not found in Google Sheets');


	// Update the sheet with the new status true
	const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1!C${rowIndex}?valueInputOption=USER_ENTERED`;
	await axios.put(updateUrl, { values: [['TRUE']] }, { headers });
}

// Helper function to create the JWT token

async function createJWT(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) {
	const header = { alg: 'RS256', typ: 'JWT' };
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: GOOGLE_CLIENT_EMAIL,
		scope: 'https://www.googleapis.com/auth/spreadsheets',
		aud: 'https://oauth2.googleapis.com/token',
		exp: now + 3600,
		iat: now,
	};

	const encodedHeader = base64urlEncode(JSON.stringify(header));
	const encodedPayload = base64urlEncode(JSON.stringify(payload));
	const dataToSign = `${encodedHeader}.${encodedPayload}`;

	const pemContents = GOOGLE_PRIVATE_KEY.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
	const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

	const privateKey = await crypto.subtle.importKey(
		'pkcs8',
		binaryDer,
		{ name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, privateKey, new TextEncoder().encode(dataToSign));
	const encodedSignature = arrayBufferToBase64(signature).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

	return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function base64urlEncode(str) {
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function arrayBufferToBase64(buffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}
