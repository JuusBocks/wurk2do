# 📱 Install Week2Do on Your iPhone

## 🎯 Quick Guide

Your app is now a **Progressive Web App (PWA)**! You can add it to your iPhone home screen and use it like a native app.

## ⚡ Quick Steps

### 1️⃣ Generate Icons (One-time setup)

The icon generator should be open in your browser. If not:

**Windows:**
```bash
start create-icons.html
```

**Mac/Linux:**
```bash
open create-icons.html
```

Then:
1. Click "Download 192x192" button → Save as `icon-192.png`
2. Click "Download 512x512" button → Save as `icon-512.png`
3. Click "Download Apple Icon" button → Save as `apple-touch-icon.png`
4. Move all 3 files to the `public/` folder in your project

### 2️⃣ Deploy to Vercel

```bash
# Add the new PWA files
git add .

# Commit
git commit -m "Add PWA support - installable on iPhone"

# Push to GitHub (if you created wurk2do repo)
git push origin main

# Vercel will auto-deploy
```

### 3️⃣ Install on iPhone

1. **Open your Vercel URL in Safari** (MUST be Safari, not Chrome!)
2. Tap the **Share button** (square with up arrow) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. You can edit the name (defaults to "Week2Do")
5. Tap **"Add"** in the top right

**🎉 Done!** The app icon will appear on your home screen!

## ✨ What You Get

When installed on iPhone home screen:

- ✅ **Full-screen app** - No Safari browser UI
- ✅ **App icon** - Beautiful icon on home screen
- ✅ **Fast loading** - Cached for instant startup
- ✅ **Offline support** - View tasks without internet
- ✅ **Native feel** - Swipe gestures, smooth animations
- ✅ **Privacy** - Still syncs with YOUR Google Drive
- ✅ **Auto-updates** - Gets new features automatically

## 📱 How to Use After Install

1. **Tap the app icon** on your home screen
2. App opens in full-screen (no Safari UI)
3. Sign in to Google Drive (first time only)
4. Start planning your week!

## 🔧 For Other Users

Share your Vercel URL and these instructions:

```
📱 Install Week2Do on iPhone:

1. Open [YOUR-VERCEL-URL] in Safari
2. Tap Share (□↑) button
3. Tap "Add to Home Screen"
4. Tap "Add"

Enjoy your privacy-focused weekly planner!
```

## 🌟 Pro Tips

### Works Offline
- View and edit tasks without internet
- Changes sync when you're back online

### Multiple Devices
- Install on iPhone, iPad, and Mac
- Data syncs via Google Drive
- Always up to date

### Update the App
- Just refresh the web version
- Updates happen automatically
- No App Store needed!

## ❓ Troubleshooting

### "Add to Home Screen" option missing
- Make sure you're using **Safari** (not Chrome)
- The app must be on **HTTPS** (Vercel provides this)
- Try refreshing the page

### Icon doesn't show
- Make sure you downloaded and saved the 3 icon files
- Check they're in the `public/` folder
- Redeploy to Vercel

### App doesn't work offline
- Give it a minute after first visit
- Service worker needs to cache files
- Try closing and reopening the app

### Google Drive won't connect
- Works the same as the web version
- Grant permissions when prompted
- Your data is still in YOUR Drive

## 🎉 Result

You now have a **self-hosted, privacy-focused weekly planner** that:
- Installs like a native app
- Works offline
- Syncs with Google Drive
- Lives on your home screen
- Costs $0 to host (Vercel free tier)

**Perfect for personal productivity!** ✨

---

**Quick Checklist:**
- [ ] Generate 3 icon files
- [ ] Move icons to `public/` folder
- [ ] Commit and push to Git
- [ ] Deploy to Vercel
- [ ] Open Vercel URL in Safari (on iPhone)
- [ ] Add to Home Screen
- [ ] Enjoy! 🎉
