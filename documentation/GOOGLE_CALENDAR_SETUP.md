# Google Calendar API Setup Guide

This guide explains how to set up Google Calendar API for the booking system.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com)

## Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** (top navigation bar)
3. Click **New Project**
4. Enter project details:
   - Project name: `bebe-booking`
   - Organization: (leave default or select your org)
5. Click **Create**
6. Wait for the project to be created, then select it

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google Calendar API"**
3. Click on **Google Calendar API** in the results
4. Click **Enable**
5. Wait for the API to be enabled

## Step 3: Configure OAuth Consent Screen

Before creating credentials, you need to configure the OAuth consent screen:

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select User Type: **External**
3. Click **Create**
4. Fill in the required fields:
   - **App name:** `Bebe Booking`
   - **User support email:** Your email address
   - **Developer contact information:** Your email address
5. Click **Save and Continue**
6. **Scopes:** Skip for now, click **Save and Continue**
7. **Test users:** Add your Google email address
8. Click **Save and Continue**
9. Review and click **Back to Dashboard**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select Application type: **Web application**
4. Enter details:
   - **Name:** `Bebe Backend`
   - **Authorized JavaScript origins:** (leave empty for now)
   - **Authorized redirect URIs:** Add the following:
     - `http://localhost:8080/auth/callback` (for local development)
     - `https://your-koyeb-domain.koyeb.app/auth/callback` (for production)
5. Click **Create**

## Step 5: Download and Save Credentials

After creating the OAuth client:

1. A dialog will show your **Client ID** and **Client Secret**
2. Click **Download JSON** to download the credentials file
3. **Important:** Keep these credentials secure and never commit them to Git

## Step 6: Configure Environment Variables

Add these to your backend environment (`.env` or Koyeb environment variables):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/callback
GOOGLE_CALENDAR_ID=your-email@gmail.com
```

**Note:** `GOOGLE_CALENDAR_ID` is usually your Gmail address (the calendar you want to use for bookings).

## Step 7: First-Time Authorization

The first time you run the backend:

1. The server will provide an authorization URL
2. Open that URL in your browser
3. Log in with your Google account
4. Grant calendar access permissions
5. You'll be redirected back to the app
6. The backend will save a refresh token for future use

## Security Notes

- **Never commit credentials to Git** - use environment variables
- The OAuth consent screen is in "Testing" mode initially - only test users can authorize
- To go to production, you'll need to verify your app with Google (submit for review)
- Store refresh tokens securely (encrypted in database or secure storage)

## Troubleshooting

### "Access Denied" or "App not verified"
- Make sure your email is added as a test user in OAuth consent screen
- Or submit app for verification (for production)

### "Redirect URI mismatch"
- The redirect URI in your code must exactly match what's configured in Google Cloud Console
- Check for trailing slashes, http vs https

### "Invalid grant"
- The refresh token may have expired or been revoked
- Re-authorize by going through the OAuth flow again

## Required Scopes

The booking system needs these Google Calendar API scopes:

- `https://www.googleapis.com/auth/calendar.readonly` - Read calendar events (check availability)
- `https://www.googleapis.com/auth/calendar.events` - Create/modify events (book appointments)

---

**Last Updated:** 2024-12-08
