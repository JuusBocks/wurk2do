# 🛠️ Development Guide - When to Restart

## 🔥 Hot Module Replacement (HMR)

When running `npm run dev`, **Vite automatically updates** most changes **without restarting**!

### ✅ **No Restart Needed** (Auto-Updates)

These changes apply **instantly** in your browser:

**React Components:**
- ✅ Changes to `.jsx` files
- ✅ UI updates
- ✅ Component logic
- ✅ Adding/removing components
- ✅ Props changes

**Styles:**
- ✅ Changes to `.css` files
- ✅ Tailwind class changes
- ✅ New CSS utilities

**Hooks:**
- ✅ Custom hook changes
- ✅ Logic updates

**Store:**
- ✅ Zustand store changes
- ✅ Action updates

**Example:**
```bash
# You edit src/components/Header.jsx
# Save file
# Browser updates INSTANTLY - no restart needed! ✨
```

### 🔄 **Restart Required** (Manual)

These changes require stopping and restarting `npm run dev`:

**Configuration Files:**
- ❌ `vite.config.js`
- ❌ `tailwind.config.js`
- ❌ `postcss.config.js`
- ❌ `.env` file changes

**Dependencies:**
- ❌ After running `npm install`
- ❌ After adding new packages

**Public Files:**
- ❌ Changes to `public/` folder files
- ❌ `manifest.json` updates
- ❌ `service-worker.js` updates

**How to Restart:**
```bash
# In terminal, press Ctrl+C
# Then run again:
npm run dev
```

## 🌐 Production Deployment (Vercel)

### **Automatic Deployment:**

When you push to GitHub, Vercel **automatically**:
1. ✅ Detects the push
2. ✅ Runs `npm run build`
3. ✅ Deploys new version
4. ✅ Updates live site

**Timeline:**
```
git push origin main
  ↓ (30 seconds)
Vercel starts building
  ↓ (1-2 minutes)
Build completes
  ↓ (instantly)
New version LIVE! 🎉
```

### **No Manual Restart Needed!**

Once deployed to Vercel:
- ✅ Users get updates automatically
- ✅ No server to restart
- ✅ Static files = instant updates
- ✅ PWA service worker handles caching

## 📱 PWA Updates (Service Worker)

### **For Users of Your App:**

When you deploy a new version, users see updates:

**First Visit After Update:**
1. Service worker detects new version
2. Downloads new files in background
3. User sees update on **next page refresh**

**To Force Update:**
- Close and reopen the app
- Or refresh the page (browser version)

### **Cache Busting:**

The service worker cache name includes version:
```javascript
const CACHE_NAME = 'wurk2do-v1';
```

When you want to force all users to update:
1. Change cache name: `'wurk2do-v2'`
2. Deploy
3. Old cache automatically deleted
4. Users get fresh version

## 🔧 Common Development Scenarios

### **Scenario 1: Changing Component UI**

```bash
# Edit src/components/TaskCard.jsx
# Save file
# ✅ Browser updates INSTANTLY
# No restart needed!
```

### **Scenario 2: Adding Google API Credentials**

```bash
# Edit .env file
# Add VITE_GOOGLE_CLIENT_ID=...
# ❌ Must restart dev server
Ctrl+C
npm run dev
```

### **Scenario 3: Updating Tailwind Config**

```bash
# Edit tailwind.config.js
# Add new color or screen size
# ❌ Must restart dev server
Ctrl+C
npm run dev
```

### **Scenario 4: Installing New Package**

```bash
npm install date-fns
# ❌ Must restart dev server
Ctrl+C
npm run dev
```

### **Scenario 5: Updating Service Worker**

```bash
# Edit public/service-worker.js
# ❌ Must restart dev server
Ctrl+C
npm run dev
# Also clear browser cache to test
```

### **Scenario 6: Changing Sync Logic**

```bash
# Edit src/hooks/useGoogleDriveSync.js
# Save file
# ✅ Browser updates INSTANTLY
# Might need to refresh if hook was already running
```

## 🎯 Quick Reference Table

| File Type | Hot Reload? | Action Needed |
|-----------|-------------|---------------|
| `.jsx` components | ✅ Yes | None - instant |
| `.css` styles | ✅ Yes | None - instant |
| `.js` utilities | ✅ Yes | None - instant |
| `vite.config.js` | ❌ No | Restart dev server |
| `tailwind.config.js` | ❌ No | Restart dev server |
| `.env` | ❌ No | Restart dev server |
| `public/*` files | ❌ No | Restart dev server |
| `package.json` deps | ❌ No | npm install + restart |
| `index.html` | ❌ No | Restart dev server |

## 💡 Development Tips

### **Tip 1: Watch the Terminal**

Vite shows what's happening:
```
✓ ready in 123 ms
⚡️ HMR update /src/App.jsx
```

If you see errors, they appear here!

### **Tip 2: Browser Console**

Check for runtime errors:
```
F12 → Console tab
Look for red errors
```

### **Tip 3: Hard Refresh**

Sometimes cache gets stuck:
```
Windows: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

### **Tip 4: Clear Service Worker**

If PWA is acting weird:
```
F12 → Application → Service Workers
Click "Unregister"
Refresh page
```

### **Tip 5: Check Vercel Logs**

Deployment issues? Check Vercel:
```
Vercel Dashboard → Your Project → Deployments
Click deployment → View Build Logs
```

## 🚀 Deployment Workflow

### **Development:**
```bash
# Make changes to code
npm run dev
# Changes apply instantly (usually)
# Test in browser
```

### **Ready to Deploy:**
```bash
# Commit changes
git add .
git commit -m "Your update message"

# Push to GitHub
git push origin main

# Vercel auto-deploys
# Wait 1-2 minutes
# Check your live URL
```

### **Check Deployment:**
```bash
# Visit Vercel dashboard
# Or check your live URL
# Should see new version!
```

## 🐛 Troubleshooting

### **"Changes not showing up"**

**In Development:**
1. Check terminal for errors
2. Try hard refresh (Ctrl+Shift+R)
3. Restart dev server
4. Clear browser cache

**In Production:**
1. Check Vercel deployed successfully
2. Wait 1-2 minutes after deployment
3. Hard refresh browser
4. Try incognito mode (bypasses cache)

### **"Service worker showing old version"**

```bash
# In browser:
F12 → Application → Service Workers
Click "Unregister"
Close browser completely
Reopen and visit site
```

### **"Environment variables not working"**

```bash
# Check .env file exists
# Verify variables start with VITE_
# Restart dev server (required!)
Ctrl+C
npm run dev
```

### **"Tailwind styles not applying"**

```bash
# Restart dev server
Ctrl+C
npm run dev

# Or rebuild
npm run build
```

## 📋 Quick Checklist

**Before Committing:**
- [ ] All files saved
- [ ] Dev server running without errors
- [ ] Tested in browser
- [ ] No console errors

**After Pushing:**
- [ ] Check Vercel deployment status
- [ ] Wait for build to complete
- [ ] Test live URL
- [ ] Check on mobile (if PWA)

**Common Mistakes:**
- ❌ Forgetting to restart after .env changes
- ❌ Not waiting for Vercel deployment
- ❌ Browser cache showing old version
- ❌ Service worker not updating

## 🎉 Summary

**99% of the time:**
- ✅ Just save and changes appear instantly!
- ✅ Vite HMR is magic ✨

**Rare cases need restart:**
- ❌ Config files
- ❌ .env changes
- ❌ Public folder files
- ❌ After npm install

**Production is automatic:**
- ✅ Push to GitHub
- ✅ Vercel deploys
- ✅ Users get updates
- ✅ No manual restart!

---

**Happy coding!** 🚀

*Vite HMR makes development blazing fast!*
