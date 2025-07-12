const fs = require("fs");
const http = require("http");
const open = require("open");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
const TOKEN_PATH = "token.json";

const credentials = require("./credentials.json");
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

function authorize() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // 👈 forces new refresh_token
  });

  console.log("🚀 Open this URL to authorize:\n", authUrl);
  open(authUrl);

  const server = http.createServer(async (req, res) => {
    if (req.url.indexOf("/oauth2callback") > -1) {
      const url = new URL(req.url, "http://localhost:3000");
      const code = url.searchParams.get("code");

      res.end("✅ Authorization successful! You can close this window.");

      server.close();

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log("✅ Token stored to", TOKEN_PATH);
    }
  }).listen(3000, () => {
    console.log("🌐 Listening on http://localhost:3000");
  });
}

authorize();
