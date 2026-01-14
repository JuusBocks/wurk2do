# Quick Start Guide - Week2Do

Get up and running in 5 minutes!

## ⚡ Fastest Path to Running App

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Get Google Credentials (2 minutes)

**Quick version:**
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Google Drive API"
4. Create "API Key" (APIs & Services → Credentials)
5. Create "OAuth 2.0 Client ID" 
   - Type: Web application
   - Add origin: `http://localhost:3000`

### 3. Create .env File (30 seconds)

Create a file named `.env` in the root folder:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 4. Run It! (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

### 5. Connect and Test (1 minute)

1. Click "Connect to Google Drive"
2. Sign in with Google
3. Click "Add Task" in any day
4. Type something and press Enter
5. Done! Your task is saved locally AND in Google Drive

## 🐳 Docker Quick Start

If you prefer Docker:

```bash
# Build and run
docker-compose up -d

# Access at
open http://localhost:8080
```

## 📖 Need More Details?

- Full setup guide: See `SETUP_GUIDE.md`
- Project structure: See `PROJECT_STRUCTURE.md`
- Main documentation: See `README.md`

## 🆘 Quick Troubleshooting

**Problem**: "Google Sign-In not initialized"  
**Fix**: Check that your `VITE_GOOGLE_CLIENT_ID` in `.env` is correct

**Problem**: API errors  
**Fix**: Make sure Google Drive API is enabled in Google Cloud Console

**Problem**: Sync not working  
**Fix**: Check that your `VITE_GOOGLE_API_KEY` is correct and has Drive API enabled

## ✅ Success Checklist

- [ ] `npm install` completed
- [ ] `.env` file created with real credentials
- [ ] `npm run dev` running without errors
- [ ] Browser opened to http://localhost:3000
- [ ] Connected to Google Drive successfully
- [ ] Created at least one task
- [ ] Task appears in Google Drive (check for `my_weektodo_data.json`)

## 🎉 What's Next?

- Drag tasks between days
- Mark tasks as complete
- Edit tasks by clicking on them
- Try disconnecting and reconnecting (data persists!)
- Check your Google Drive for the data file

**Enjoy your privacy-focused weekly planner!** 🚀

