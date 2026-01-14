# 📱 PWA Setup - Add Week2Do to iPhone Home Screen

Your app is now a **Progressive Web App (PWA)**! Users can install it on their iPhone home screen like a native app.

## 🎯 What's Been Added

### 1. PWA Manifest (`public/manifest.json`)
- App name, icons, colors
- Display mode: standalone (full-screen)
- Theme color: dark (#0f0f0f)

### 2. Service Worker (`public/service-worker.js`)
- Offline functionality
- Faster loading with caching
- Background sync ready

### 3. App Icons
- 192x192 (Android)
- 512x512 (Android splash)
- 180x180 (Apple touch icon)

### 4. Enhanced Meta Tags
- iOS web app capable
- Status bar styling
- Mobile optimizations

## 🎨 Step 1: Generate Icons

Open `create-icons.html` in your browser:

```bash
# Windows
start create-icons.html

# Mac
open create-icons.html
```

1. Click each "Download" button
2. Save the 3 PNG files
3. Move them to the `public/` folder:
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`

**OR** use your own custom icons (same sizes).

## 📦 Step 2: Deploy to Vercel

```bash
# Commit the PWA changes
git add .
git commit -m "Add PWA support for iOS home screen installation"
git push

# Vercel will auto-deploy
```

## 📱 Step 3: Add to iPhone Home Screen

### For You (Developer)
1. Open your Vercel URL in **Safari** (must be Safari!)
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit name if desired
5. Tap **"Add"**

The app icon will appear on your home screen! 🎉

### For Users
Share these instructions:

```
iPhone Instructions:
1. Open [your-app-url] in Safari
2. Tap the Share button (□↑)
3. Tap "Add to Home Screen"
4. Tap "Add"

Android Instructions:
1. Open [your-app-url] in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Add"
```

## ✨ Features When Installed

### iOS Home Screen App Benefits:
- ✅ **Full-screen** - No Safari UI
- ✅ **App icon** - On home screen
- ✅ **Splash screen** - Professional loading
- ✅ **Offline support** - Works without internet
- ✅ **Fast loading** - Cached assets
- ✅ **Native feel** - Feels like a real app

### What It Includes:
- ✅ All your tasks persist
- ✅ Google Drive sync still works
- ✅ Dark mode theme
- ✅ Drag and drop
- ✅ Mobile-optimized UI
- ✅ Offline task viewing

## 🔧 Customization

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

### Change Theme Color
Edit `public/manifest.json` and `index.html`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Custom Icons
Replace files in `public/`:
- Create 192x192, 512x512, and 180x180 PNG icons
- Use your logo/design
- Keep filenames the same

## 🧪 Testing PWA Features

### Test Service Worker
1. Open DevTools → Application tab
2. Check "Service Workers"
3. Should show "activated and running"

### Test Offline
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. App should still load!

### Test Manifest
1. Open DevTools → Application tab
2. Check "Manifest"
3. Should show all icons and metadata

## 📊 PWA Checklist

Before deploying:
- [ ] Icons generated and in `public/` folder
- [ ] `manifest.json` has correct app name
- [ ] Service worker registered (check console)
- [ ] HTTPS enabled (required for PWA)
- [ ] Tested on actual iPhone
- [ ] Tested offline functionality
- [ ] Tested "Add to Home Screen"

## 🚀 Advanced: Install Prompt

To show a custom install prompt, add to `src/App.jsx`:

```javascript
const [installPrompt, setInstallPrompt] = useState(null);

useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setInstallPrompt(e);
  });
}, []);

const handleInstall = () => {
  if (installPrompt) {
    installPrompt.prompt();
  }
};
```

Then add a button:
```jsx
{installPrompt && (
  <button onClick={handleInstall}>
    📱 Install App
  </button>
)}
```

## 🎯 What Happens Next

1. **Users visit your Vercel URL**
2. **Safari detects PWA manifest**
3. **Users can "Add to Home Screen"**
4. **App installs like a native app**
5. **Launches in full-screen mode**
6. **Works offline with cached data**

## 🔍 Troubleshooting

### "Add to Home Screen" not showing
- Must use **Safari** on iOS (not Chrome)
- Must be **HTTPS** (Vercel provides this)
- Check manifest.json is accessible

### Icons not showing
- Clear Safari cache
- Regenerate icons
- Check file paths in manifest.json

### Offline not working
- Check service worker is registered
- Look for console errors
- Verify HTTPS connection

### App doesn't update
- Uninstall and reinstall
- Clear cache
- Deploy new version changes cache name

## 📱 Result

Your users can now:
- Install Week2Do on their iPhone home screen
- Use it like a native app
- Access it offline
- Get a full-screen experience
- Sync with Google Drive seamlessly

**Perfect for a privacy-focused, self-hosted weekly planner!** 🎉

---

**Next Steps:**
1. Generate icons with `create-icons.html`
2. Add icons to `public/` folder
3. Commit and push to GitHub
4. Test on your iPhone!
