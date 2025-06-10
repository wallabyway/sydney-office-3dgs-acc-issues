import jwt from 'jsonwebtoken';

// Add global variables for API URLs and scope
export const TOKEN_URL = "https://developer.api.autodesk.com/authentication/v2/token";
const privateKey = process.env.APS_PRIVATE_KEY.replace(/\\n/g, '\n');

// Generates a JWT assertion with RS256 using config credentials.
export function generateJwtAssertion() {
  return jwt.sign(
    {
      iss: process.env.APS_CLIENT_ID,
      sub: process.env.SERVICE_ACCOUNT_ID,
      aud: TOKEN_URL,
      exp: Math.floor(Date.now() / 1000) + 300,
      scope: process.env.APS_SCOPE.split(' ')
    },
    privateKey,
    {
      algorithm: "RS256",
      header: { alg: "RS256", kid: process.env.KEY_ID },
    }
  );
}

export async function getToken() {
  const jwtAssertion = generateJwtAssertion();
  const tokenResponse = await getAccessToken(jwtAssertion);
  return tokenResponse.access_token;
}

// Requests an access token using a JWT assertion from Autodesk API.
export async function getAccessToken(jwtAssertion) {
  const basicAuth = `Basic ${Buffer.from(
    `${process.env.APS_CLIENT_ID}:${process.env.APS_CLIENT_SECRET}`
  ).toString("base64")}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuth,
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtAssertion,
      scope: process.env.APS_SCOPE,
    }),
  });
  return response.json();
} 
