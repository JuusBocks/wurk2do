# 🚀 START HERE - Week2Do

Welcome! This is your privacy-focused weekly planner application.

## 🎯 What You Have

A complete, production-ready React application with:
- ✅ Beautiful weekly planner UI
- ✅ Drag-and-drop task management
- ✅ Google Drive sync for backup
- ✅ Local-first (works offline)
- ✅ Docker deployment ready
- ✅ Complete documentation

## ⚡ Quick Start (5 Minutes)

### Option 1: Automated Installation (Recommended)

**On Windows:**
```powershell
.\install.ps1
```

**On Mac/Linux:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# 3. Edit .env and add Google credentials
notepad .env  # Windows
nano .env     # Mac/Linux

# 4. Run the app
npm run dev
```

## 🔑 Getting Google Credentials (2 Minutes)

You need these to enable Google Drive sync:

1. **Go to**: https://console.cloud.google.com/
2. **Create** a new project
3. **Enable** "Google Drive API" (in API Library)
4. **Create credentials**:
   - API Key (for Drive access)
   - OAuth 2.0 Client ID (for sign-in)
     - Type: Web application
     - Authorized origin: `http://localhost:3000`
5. **Copy** credentials to `.env` file

**Detailed guide**: See `SETUP_GUIDE.md`

## 📚 Documentation Guide

Pick the guide that matches your needs:

| Document | Best For | Reading Time |
|----------|----------|--------------|
| `QUICK_START.md` | Getting it running fast | 5 min |
| `SETUP_GUIDE.md` | Detailed setup steps | 15 min |
| `SUMMARY.md` | Project overview | 10 min |
| `PROJECT_STRUCTURE.md` | Understanding file layout | 15 min |
| `ARCHITECTURE.md` | Technical deep-dive | 30 min |
| `README.md` | Features & deployment | 10 min |

## 🎨 What You Can Do

### Basic Usage
1. **Add tasks**: Click "+ Add Task" in any day
2. **Edit tasks**: Click on task text
3. **Complete tasks**: Click checkbox
4. **Delete tasks**: Hover and click X
5. **Move tasks**: Drag between days
6. **Sync**: Connect to Google Drive

### Customization
- Change colors: `tailwind.config.js`
- Change app name: `index.html` & `src/components/Header.jsx`
- Change sync delay: `src/config/constants.js`
- Add features: All files are well-documented

## 🐳 Deployment Options

### Docker (Easiest for Self-Hosting)
```bash
docker-compose up -d
```
Access at `http://localhost:8080`

### Static Hosting (Free Options)
```bash
npm run build
# Upload /dist folder to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - GitHub Pages
```

**Important**: Production needs HTTPS for Google OAuth!

## 🗂️ Project Layout

```
week2do/
├── 📚 6 Documentation files (you're reading one!)
├── ⚙️ 7 Configuration files (package.json, vite, etc.)
├── 🐳 4 Docker files (deployment ready)
├── 🌐 1 HTML file (index.html)
└── 📦 src/ (all source code)
    ├── App.jsx (main app)
    ├── components/ (UI pieces)
    ├── hooks/ (Google Drive integration)
    ├── store/ (state management)
    └── config/ (settings)
```

## 🔒 Privacy Features

- ✅ **No backend** - runs entirely in your browser
- ✅ **Your Google Drive** - data in YOUR account
- ✅ **Minimal permissions** - can only access its own files
- ✅ **Local-first** - works without internet
- ✅ **Open source** - audit the code yourself

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality

# Docker
npm run docker:build     # Build Docker image
npm run docker:compose   # Run with docker-compose
npm run docker:down      # Stop containers
```

## ✅ Verification Checklist

Before you start using the app:

- [ ] Node.js 18+ installed
- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] API Key added to `.env`
- [ ] OAuth Client ID added to `.env`
- [ ] `npm run dev` runs without errors
- [ ] Browser opens to localhost:3000
- [ ] "Connect to Google Drive" button visible

## 🆘 Common Issues

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Google Sign-In not initialized"
- Check `VITE_GOOGLE_CLIENT_ID` in `.env`
- Verify authorized origin in Google Cloud Console

### "Sync failed"
- Check `VITE_GOOGLE_API_KEY` in `.env`
- Ensure Google Drive API is enabled

### Port 3000 already in use
```bash
# Edit vite.config.js, change port to 3001
npm run dev
```

## 🎓 Learning Path

### Beginner
1. Read `QUICK_START.md`
2. Get it running
3. Try all features
4. Read `SUMMARY.md` for overview

### Intermediate
1. Read `SETUP_GUIDE.md`
2. Deploy with Docker
3. Read `PROJECT_STRUCTURE.md`
4. Start customizing

### Advanced
1. Read `ARCHITECTURE.md`
2. Understand data flow
3. Add new features
4. Deploy to production

## 🎯 Next Steps

Choose your path:

### Just Want to Use It?
```bash
npm install
# Add Google credentials to .env
npm run dev
# Start planning! 📅
```

### Want to Deploy It?
→ See `README.md` section "Deployment"

### Want to Customize It?
→ See `PROJECT_STRUCTURE.md`

### Want to Understand It?
→ See `ARCHITECTURE.md`

## 🌟 Pro Tips

1. **Keyboard shortcuts**:
   - `Enter` to save when editing
   - `Escape` to cancel

2. **Offline mode**:
   - Works without internet
   - Syncs when reconnected

3. **Data backup**:
   - Automatic to Google Drive
   - Also in LocalStorage
   - Check Drive for `my_weektodo_data.json`

4. **Mobile friendly**:
   - Responsive design
   - Touch-friendly
   - Works on all devices

5. **Self-hosting**:
   - No external dependencies
   - Full control of data
   - Easy Docker deployment

## 💬 Need Help?

1. **Check documentation** - 6 files covering everything
2. **Browser console** - Look for error messages
3. **Google Cloud Console** - Check API quotas/errors
4. **GitHub Issues** - Search or open new issue

## 🎉 You're Ready!

Everything is set up and ready to go. Just need to:
1. Install dependencies
2. Add Google credentials
3. Start the dev server

**Time to build your productivity system!** 🚀

---

**Quick Commands Reminder:**
```bash
npm install              # Install
npm run dev             # Run
open http://localhost:3000  # Use
```

**Happy Planning!** 📅✨

