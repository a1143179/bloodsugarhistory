# Quick Google OAuth Setup

## Step 1: Get Google OAuth Client ID

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Create a new project or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" → Click "Enable"
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - **Name**: "Medical Tracker Frontend"
   - **Authorized JavaScript origins**:
     - `http://localhost:55555` (development)
     - `https://your-domain.com` (production)
   - **Authorized redirect URIs**: Leave empty (not needed for frontend-only)
5. **Copy Client ID**: Copy the generated Client ID

## Step 2: Configure Client ID

### For Local Development:
1. **Open**: `src/config/environment.js`
2. **Find line**: `googleClientId: 'YOUR_GOOGLE_CLIENT_ID'`
3. **Replace**: `'YOUR_GOOGLE_CLIENT_ID'` with your actual Client ID
4. **Example**:
   ```javascript
   googleClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
   ```

### For Production (Azure):
1. **Set Environment Variable**: `REACT_APP_GOOGLE_CLIENT_ID`
2. **Value**: Your Google OAuth Client ID
3. **The app will automatically use this in production**

## Step 3: Test

1. **Start frontend**: `npm start`
2. **Go to**: `http://localhost:55555`
3. **Click**: Google Sign-In button
4. **Should work**: No more "invalid_client" error

## Troubleshooting

- **"invalid_client"**: Make sure you replaced the placeholder with your actual Client ID
- **"redirect_uri_mismatch"**: Add `http://localhost:55555` to authorized JavaScript origins
- **"OAuth consent screen"**: Configure the consent screen in Google Cloud Console

## Security Note

The Client ID is safe to expose in frontend code - it's designed to be public. 