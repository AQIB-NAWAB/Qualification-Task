import axios from 'axios';

export default {
  async fetch(request, env, ctx) {
    try {
      
      //  Env's from secrets
      const GOOGLE_CLIENT_EMAIL = env.GOOGLE_CLIENT_EMAIL;
      const GOOGLE_PRIVATE_KEY = env.GOOGLE_PRIVATE_KEY;
      const GOOGLE_SHEET_ID = env.GOOGLE_SHEET_ID;

   
      if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
        throw new Error('Missing required environment variables.');
      }

      // Data
      const data = await getSheetData(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID);
      
      if (!data || data.length < 1) {
        throw new Error('No data found in sheet');
      }

      // Headers[0] -> Header Index
      const headers = data[0];
      const certIndex = headers.indexOf('isAssigned');

      if (certIndex === -1) {
        throw new Error('isAssigned column not found');
      }

// Pending users 
      const filteredUsers = data.slice(1).map((row, index) => {
        if (row[certIndex]?.toUpperCase() === 'FALSE') {
          const user = headers.reduce((obj, header, i) => {
            obj[header] = row[i] || null;
            return obj;
          }, {});
          
          user.rowIndex = index + 2; 
          return user;
        }
        return null;
      }).filter(Boolean);

      return new Response(JSON.stringify(filteredUsers), {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};


// Getting Data from google sheet
async function getSheetData(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID) {
	const accessToken = await getAccessToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1`;
	const response = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data.values;
}


// generation of Access Token
async function getAccessToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY) {
	const header = {
		alg: 'RS256',
		typ: 'JWT',
	};

	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: GOOGLE_CLIENT_EMAIL,
		scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
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
		{
			name: 'RSASSA-PKCS1-v1_5',
			hash: { name: 'SHA-256' },
		},
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, privateKey, new TextEncoder().encode(dataToSign));

	const encodedSignature = arrayBufferToBase64(signature).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

	const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

	const response = await axios.post('https://oauth2.googleapis.com/token', {
		grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
		assertion: jwt,
	});

	return response.data.access_token;
}

// Helper functions
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
