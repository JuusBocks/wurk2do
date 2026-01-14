# Week2Do - Complete Setup Guide

This guide will walk you through setting up Week2Do from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Google account
- (Optional) Docker and Docker Compose for containerized deployment

## 🔑 Google Cloud Setup (Critical Step)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Week2Do" (or any name you prefer)
4. Click "Create"

### Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key (you'll need this for `.env`)
4. (Optional but recommended) Click "Restrict Key":
   - Application restrictions: HTTP referrers
   - Add your domains: `http://localhost:3000/*`, `https://yourdomain.com/*`
   - API restrictions: Select "Google Drive API"

### Step 4: Create OAuth 2.0 Client ID

1. Still in "Credentials", click "Create Credentials" → "OAuth client ID"
2. If prompted, configure OAuth consent screen first:
   - User Type: External (for public use) or Internal (for organization only)
   - App name: "Week2Do"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: You can skip this, we'll use minimal scopes in the app
   - Test users: Add your email (for testing phase)
   - Click "Save and Continue" through all steps

3. Back to creating OAuth Client ID:
   - Application type: Web application
   - Name: "Week2Do Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `http://localhost:8080` (for Docker)
     - Add your production URL if deploying
   - Authorized redirect URIs: (can be empty for this app)
   - Click "Create"

4. Copy the Client ID (format: `xxxxx.apps.googleusercontent.com`)

## 🚀 Local Development Setup

### Step 1: Install Dependencies

```bash
cd week2do
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your credentials (replace with your actual values):

```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **Important**: Never commit `.env` to version control! It's already in `.gitignore`.

### Step 3: Run Development Server

```bash
npm run dev
```

The app should open at `http://localhost:3000`

### Step 4: Test the Application

1. Click "Connect to Google Drive"
2. Sign in with your Google account
3. Grant permissions (the app only requests access to files it creates)
4. Start adding tasks!
5. Tasks should automatically sync to your Google Drive

## 🐳 Docker Deployment

### Option 1: Docker Compose (Easiest)

```bash
# Build and run in detached mode
docker-compose up -d

# Check logs
docker-compose logs -f week2do

# Stop
docker-compose down
```

Access at `http://localhost:8080`

### Option 2: Plain Docker

```bash
# Build the image
docker build -t week2do:latest .

# Run the container
docker run -d \
  --name week2do \
  -p 8080:80 \
  --restart unless-stopped \
  week2do:latest

# Check logs
docker logs -f week2do

# Stop and remove
docker stop week2do
docker rm week2do
```

### Deployment Notes

⚠️ **Important for Production**: 

1. Update OAuth authorized origins in Google Cloud Console to include your production domain
2. Update authorized JavaScript origins: `https://yourdomain.com`
3. Consider using HTTPS (required for production OAuth)
4. The app is client-side only, so it works with any static hosting (Nginx, Apache, Netlify, Vercel, etc.)

## 🔒 Security Best Practices

### For Development
- Keep `.env` file secure and never commit it
- Use separate Google Cloud projects for dev/prod

### For Production
- **Always use HTTPS** (required by Google for OAuth in production)
- Restrict API keys to your domain
- Regularly rotate credentials
- Monitor API usage in Google Cloud Console

## 🎨 Customization

### Change App Name and Branding

Edit `index.html`:
```html
<title>Your App Name</title>
```

Edit `src/components/Header.jsx`:
```jsx
<h1 className="text-2xl font-bold">Your App Name</h1>
```

### Change Data File Name

Edit `src/config/constants.js`:
```javascript
FILE_NAME: 'your_custom_filename.json',
```

### Customize Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  dark: {
    bg: '#your-color',
    surface: '#your-color',
    // ... etc
  }
}
```

## 🐛 Troubleshooting

### "Google Sign-In not initialized"
- Make sure Google API scripts are loaded (check browser console)
- Verify your Client ID is correct in `.env`
- Check that authorized origins match your current URL

### "Sync failed" or "Failed to initialize Google API"
- Verify API Key is correct and has Google Drive API enabled
- Check Google Cloud Console quotas (free tier has limits)
- Ensure Google Drive API is enabled for your project

### Tasks not syncing
- Check browser console for errors
- Verify internet connection
- Check sync status in header (should show green checkmark)
- Try manual sync button
- Check Google Cloud Console for API errors

### OAuth consent screen issues
- Make sure you've added your email to test users (if app is in testing mode)
- Publishing the app to production removes the test user limit

## 📊 Monitoring

### Check API Usage
1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Dashboard"
3. Click on "Google Drive API"
4. View quotas and usage

### LocalStorage Inspection
Open browser DevTools:
- Application tab → Local Storage → `http://localhost:3000`
- Look for key: `week2do_data`

### Google Drive File
- The app creates `my_weektodo_data.json` in your Drive root
- You can view/download it directly from Google Drive

## 🔄 Backup and Migration

### Export Data
1. Open browser DevTools → Console
2. Run:
```javascript
copy(localStorage.getItem('week2do_data'))
```
3. Paste into a text file and save

### Import Data
```javascript
localStorage.setItem('week2do_data', 'paste_your_data_here')
location.reload()
```

## 📱 Mobile Access

The app is fully responsive! To use on mobile:

1. Deploy to a server with HTTPS
2. Add authorized origin in Google Cloud Console
3. Access from mobile browser
4. (Optional) Add to home screen for app-like experience:
   - Chrome: Menu → "Add to Home screen"
   - Safari: Share → "Add to Home Screen"

## 🆘 Getting Help

If you encounter issues:
1. Check browser console for errors
2. Review this guide thoroughly
3. Verify Google Cloud setup
4. Check GitHub issues
5. Open a new issue with:
   - Error messages
   - Browser and OS
   - Steps to reproduce

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] API Key created and restricted
- [ ] OAuth Client ID created
- [ ] Authorized origins configured
- [ ] `.env` file created with correct credentials
- [ ] `npm install` completed successfully
- [ ] `npm run dev` runs without errors
- [ ] App opens in browser
- [ ] "Connect to Google Drive" works
- [ ] Can add/edit/delete tasks
- [ ] Tasks sync to Google Drive
- [ ] Can see file in Google Drive

## 🎉 You're Done!

Congratulations! Your Week2Do app is now set up and ready to use. Enjoy your privacy-focused weekly planning!

