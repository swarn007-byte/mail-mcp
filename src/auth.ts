import { google } from 'googleapis';

import fs from 'fs'
import http from 'http'
import open from 'open';

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.YOUR_REDIRECT_URL
);




const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
  ];

async function savetokensecurely(tokens) {
    try {
        if(tokens){
            fs.writeFileSync('./token.json',JSON.stringify(tokens));
        }
    } catch(error) {
        throw error;  
    }
}
async function getAuthenticatedClient() {
    if (fs.existsSync('./token.json')) {
      const token = JSON.parse(fs.readFileSync('./token.json', 'utf-8'));
      oauth2Client.setCredentials(token);
      return oauth2Client; // ← don't forget to return
    } else {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
    
        // open browser
        await open(url);
    
        // start local server to catch the callback code
        return new Promise((resolve, reject) => {
            const server = http.createServer(async (req, res) => {
                const code = new URL(req.url!, 'http://localhost:3000').searchParams.get('code');
                if (code) {
                    res.end('Authentication successful! You can close this tab.');
                    server.close();
                    await handlehandleOAuth2Callback(code);
                    resolve(oauth2Client);
                }
            });
            server.listen(3000);
        });
    }
}
  
    // else → open browser + start server (next step)
  

  async function handlehandleOAuth2Callback(code) {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        await savetokensecurely(tokens);
    } catch (err) {
        console.log('failed to exchange code for token', err);
        throw err;
    }

}


// now user can redirect to
// GET /oauthcallback?code={authorizationCode} 

// This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.


//handle refresh token

// oauth2Client.on('tokens', (tokens) => {
//     if (tokens.refresh_token) {
//       // store the refresh_token in my database!
//       console.log(tokens.refresh_token);
//     }
//     console.log(tokens.access_token);
//   });

//   oauth2Client.setCredentials({
//     refresh_token: `STORED_REFRESH_TOKEN`
//   });


// Function to restore credentials from stored tokens
function restoreCredentials(storedTokens) {
    oauth2Client.setCredentials(storedTokens);
}
oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        // Store new refresh token
        savetokensecurely(tokens);
    }
});



export{
    handlehandleOAuth2Callback,
    restoreCredentials,
    oauth2Client,
    getAuthenticatedClient,
    savetokensecurely
  };