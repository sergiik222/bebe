import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const TOKEN_PATH = path.join(process.cwd(), 'lib', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'lib', 'credentials.json');

const loadCredentials = () => {
    try {
        const content = fs.readFileSync(CREDENTIALS_PATH);
        return JSON.parse(content);
    } catch (err) {
        console.error('Error loading client secret file:', err);
        return null;
    }
};

const authorize = async (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (err) {
        console.error('Error loading token:', err);
        throw err;
    }
};

const listFiles = async (auth, folderId) => {
    const drive = google.drive({ version: 'v3', auth });
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/')`,
            fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
        });
        return res.data.files;
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
        return new Response(JSON.stringify({ error: 'Missing folderId parameter' }), { status: 400 });
    }

    try {
        console.log('Loading credentials...');
        const credentials = loadCredentials();
        if (!credentials) {
            throw new Error('Failed to load credentials');
        }

        console.log('Authorizing...');
        const auth = await authorize(credentials);
        if (!auth) {
            throw new Error('Failed to authorize');
        }

        console.log(`Listing files in folder: ${folderId}`);
        const files = await listFiles(auth, folderId);
        return new Response(JSON.stringify(files), { status: 200 });
    } catch (error) {
        console.error('Failed to fetch files:', error.message);
        return new Response(JSON.stringify({ error: 'Failed to fetch files' }), { status: 500 });
    }
}
