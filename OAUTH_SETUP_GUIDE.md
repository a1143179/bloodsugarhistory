# Google OAuth Setup Guide (Frontend-Only)

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:55555` (development)
     - `https://your-frontend-domain.com` (production)
   - **No redirect URIs needed** (frontend handles OAuth directly)
5. Copy your Client ID

## Step 2: Update Frontend Configuration

1. Open `src/contexts/AuthContext.js`
2. Replace the placeholder client ID:
   ```javascript
   window.google.accounts.id.initialize({
     client_id: 'YOUR_ACTUAL_CLIENT_ID_HERE', // Replace with your actual client ID
     callback: handleCredentialResponse,
     auto_select: false,
     cancel_on_tap_outside: true,
   });
   ```

## Step 3: Test OAuth

1. Start your frontend: `npm start`
2. Go to `http://localhost:55555`
3. Click the Google Sign-In button
4. You should see Google's OAuth popup

## How It Works

- **Frontend-only**: No backend required for authentication
- **Google Identity Services**: Uses Google's official JavaScript library
- **Direct OAuth**: Frontend handles the entire OAuth flow
- **JWT Tokens**: Google provides JWT tokens that contain user information
- **Local Storage**: User session is stored in browser localStorage

## Troubleshooting

- **"Google Identity Services not loaded"**: Check that the Google script is loading properly
- **"Invalid client"**: Make sure your Client ID is correct in AuthContext.js
- **"OAuth consent screen"**: Configure the OAuth consent screen in Google Cloud Console

## Security Notes

- The Google Client ID is safe to expose in frontend code
- User data is stored in localStorage (consider encryption for sensitive data)
- JWT tokens from Google are verified by Google's servers

## Backend Integration (Optional)

If you want to use a backend for data storage:
1. Send the Google JWT token to your backend
2. Verify the token on the backend
3. Create/update user records in your database
4. Return your own JWT token for API authentication 