import { gmail_v1, google } from 'googleapis';
import { oauth2Client } from './auth.js';

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function listEmails(maxResults: number, query?: string) {
    const result = await gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: query,
    });

    return result.data.messages; 
}
async function sendEmail(to: string, subject: string, body: string) {
    const rawEmail = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain`,
        ``,
        body
    ].join('\n');

    const encoded = Buffer.from(rawEmail)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encoded }
    });

    return result.data;
}
async function getEmail(id: string) {
    const result = await gmail.users.messages.get({
        userId: 'me',
        id: id,
        format: 'full'
    });
    return result.data;
}
async function deleteEmail(id: string) {
    const result = await gmail.users.messages.delete({
        userId: 'me',
        id: id,
    });
    return result.data;
}

export {sendEmail,getEmail,listEmails,deleteEmail}