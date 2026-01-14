# 🔄 Google Drive Sync Information

## How Sync Works in wurk2do

Your wurk2do app uses a **local-first** approach with **8-hour cloud backup** to Google Drive.

## 🎯 Sync Strategy

### **Immediate (Local Storage)**
✅ Every change saves **instantly** to LocalStorage
- Add task → Saved immediately
- Edit task → Saved immediately  
- Delete task → Saved immediately
- Drag task → Saved immediately

**Result**: App always feels fast and responsive!

### **Every 8 Hours (Google Drive)**
☁️ Automatic backup to Google Drive **every 8 hours**
- Syncs in the background (morning, afternoon, evening)
- No interruption to your work
- Minimal API calls - very conservative
- Excellent battery life on mobile

### **Manual Sync**
🔄 Click the refresh button anytime to force sync
- Useful before closing the app
- Useful when switching devices
- Good practice at end of work session

## 📊 Sync Frequency

| Event | LocalStorage | Google Drive |
|-------|-------------|--------------|
| Add/Edit/Delete task | ✅ Instant | ⏰ Next 8-hour sync |
| Manual sync button | ✅ Instant | ✅ Immediate |
| App startup | ✅ Loads local | ☁️ Checks Drive |
| 8-hour auto-sync | - | ☁️ Uploads changes |

## 🔒 Why 8 Hours?

### **Benefits:**
1. **Minimal API calls** - Only 3 syncs per day!
2. **Excellent battery life** - Very few network requests on mobile
3. **Still protected** - Changes backed up within 8 hours
4. **Manual override** - Can always force sync immediately
5. **Faster app** - No waiting for cloud sync after each change
6. **Zero API concerns** - Well under any rate limits

### **Google Drive API Usage:**
- Free tier: 1 billion queries/day
- 8-hour sync: **Only ~3 syncs per day** (morning/afternoon/evening)
- Very conservative approach

## 💡 Best Practices

### **For Single Device Users:**
- Let hourly sync run automatically
- No action needed!
- Use manual sync before closing app (optional)

### **For Multi-Device Users:**
1. **Before switching devices:**
   - Click manual sync button
   - Wait for "Synced" confirmation

2. **When opening on new device:**
   - Connect to Google Drive
   - App will pull latest data
   - Start working!

3. **If you forget:**
   - No problem! Next 8-hour sync will handle it
   - Or just use manual sync when switching devices

## 🔄 Sync Status Indicators

### **In the Header:**

**"Syncing..."** 🟡
- Currently uploading to Drive
- Takes 1-2 seconds

**"Last: 14:30"** 🟢
- Last successful sync time
- Everything is backed up

**"Sync failed"** 🔴
- Connection issue or API error
- Click manual sync to retry
- Check internet connection

## 📱 Mobile Considerations

### **Installed as PWA (Home Screen App):**
- Syncs in background when app is open
- Pauses when app is closed (iOS limitation)
- Resumes when you open app again

### **To ensure sync on mobile:**
1. Open the app
2. Let it run for a few seconds
3. Check sync status shows recent time
4. Safe to close

## 🛠️ Troubleshooting

### **"Changes not syncing between devices"**
1. Check both devices are connected to Drive (blue checkmark)
2. Click manual sync on first device
3. Wait 5 seconds
4. Open second device and it should load new data

### **"Sync taking too long"**
- Normal sync takes 1-2 seconds
- If stuck >10 seconds, click disconnect and reconnect
- Check internet connection

### **"Want to sync more/less frequently?"**
Edit `src/config/constants.js`:
```javascript
// Current: 8 hours
export const AUTO_SYNC_INTERVAL = 8 * 60 * 60 * 1000;

// Examples:
// 1 hour: 60 * 60 * 1000
// 4 hours: 4 * 60 * 60 * 1000
// 12 hours: 12 * 60 * 60 * 1000
// 24 hours: 24 * 60 * 60 * 1000
```

## 🎯 Summary

**Your data is always safe:**
- ✅ Instant save to LocalStorage (device storage)
- ✅ 8-hour backup to Google Drive (cloud)
- ✅ Manual sync available anytime
- ✅ Multi-device support
- ✅ Privacy-first (YOUR Google Drive only)

**You can't lose data because:**
1. LocalStorage saves every change instantly
2. Google Drive backs up every 8 hours (or manual)
3. Manual sync always available
4. Both sources always accessible

**Best of both worlds:**
- Speed of local storage
- Safety of cloud backup
- Privacy of self-hosting
- No monthly fees!

---

**Happy planning!** 📅✨

*Syncs every 8 hours • Saves instantly • Privacy-focused*
