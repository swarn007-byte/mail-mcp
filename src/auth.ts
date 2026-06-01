import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.YOUR_REDIRECT_URL
);


//this apps wants to see your blogger and calender data--then user accept or reject
const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
  ];

const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    // If you only need one scope, you can pass it as a string
    scope: scopes
});

// now user can redirect to
// GET /oauthcallback?code={authorizationCode} 

// This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.
const { tokens } = await oauth2Client.getToken(code)
oauth2Client.setCredentials(tokens);

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

async function savetokensecurely(tokens) {
    try {
        console.log('token saved', tokens);

    } catch(error) {
        throw error;  
    }
}

export{
    handlehandleOAuth2Callback,
    restoreCredentials,
    oauth2Client,
  };