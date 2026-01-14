# Week2Do - Project Structure

## 📁 Complete File Tree

```
week2do/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS customization
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .eslintrc.cjs             # ESLint rules
│   ├── .gitignore                # Git ignore patterns
│   └── .env.example              # Environment variables template
│
├── 🐳 Docker Files
│   ├── Dockerfile                # Docker image definition
│   ├── docker-compose.yml        # Docker Compose orchestration
│   ├── nginx.conf                # Nginx web server config
│   └── .dockerignore             # Docker build ignore patterns
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── SETUP_GUIDE.md            # Detailed setup instructions
│   └── PROJECT_STRUCTURE.md      # This file
│
├── 🌐 HTML Entry
│   └── index.html                # HTML template with Google API script
│
└── 📦 Source Code (src/)
    │
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Main application component
    ├── index.css                 # Global styles and Tailwind directives
    │
    ├── 🎨 components/            # React Components
    │   ├── Header.jsx            # Top navigation with sync controls
    │   ├── WeekView.jsx          # Main week layout with DnD context
    │   ├── DayColumn.jsx         # Individual day column (droppable)
    │   └── TaskCard.jsx          # Task item (draggable)
    │
    ├── 🪝 hooks/                 # Custom React Hooks
    │   └── useGoogleDriveSync.js # Google Drive API integration
    │
    ├── 📊 store/                 # State Management
    │   └── useTaskStore.js       # Zustand store for tasks
    │
    └── ⚙️ config/                # Configuration
        └── constants.js          # App constants and configs
```

## 🔍 Key Files Explained

### Core Application Files

#### `src/main.jsx`
- React application entry point
- Renders the root App component
- Imports global styles

#### `src/App.jsx`
- Main application orchestrator
- Initializes Google Drive sync
- Renders Header and WeekView
- Manages authentication state

#### `src/index.css`
- Tailwind CSS directives (`@tailwind base/components/utilities`)
- Custom scrollbar styles
- Global CSS utilities

### Components

#### `src/components/Header.jsx`
**Purpose**: Top navigation bar with Google Drive sync controls

**Props**:
- `isAuthenticated`: Boolean - Drive connection status
- `syncStatus`: String - Current sync state (idle/syncing/success/error)
- `lastSyncTime`: Number - Timestamp of last successful sync
- `error`: String - Error message if any
- `onConnect`: Function - Trigger Google Sign-In
- `onDisconnect`: Function - Sign out from Google
- `onManualSync`: Function - Manual sync trigger

**Features**:
- Shows app branding
- Displays sync status with visual indicators
- Connect/Disconnect buttons
- Manual sync button

#### `src/components/WeekView.jsx`
**Purpose**: Main week layout with drag-and-drop context

**Props**:
- `onDataChange`: Function - Called when tasks change (triggers sync)

**Features**:
- Wraps all days in DragDropContext
- Calculates current week dates (Monday to Sunday)
- Handles drag-and-drop events
- Renders 7 DayColumn components

**State**: Connected to Zustand store for task data

#### `src/components/DayColumn.jsx`
**Purpose**: Represents a single day with its tasks

**Props**:
- `day`: String - Day name (e.g., "Monday")
- `tasks`: Array - List of tasks for this day
- `date`: Date - The actual date
- `isToday`: Boolean - Highlight if today
- `onAddTask`: Function - Add new task handler
- `onUpdateTask`: Function - Update task handler
- `onDeleteTask`: Function - Delete task handler

**Features**:
- Droppable zone for drag-and-drop
- Task count and completion statistics
- Inline task creation form
- Scrollable task list

#### `src/components/TaskCard.jsx`
**Purpose**: Individual task item with interactions

**Props**:
- `task`: Object - Task data `{ id, text, completed, createdAt }`
- `index`: Number - Position in list (for DnD)
- `day`: String - Parent day
- `onUpdate`: Function - Update handler
- `onDelete`: Function - Delete handler

**Features**:
- Draggable task item
- Checkbox to mark complete/incomplete
- Inline editing on click
- Delete button (shown on hover)
- Visual feedback during drag

### Hooks

#### `src/hooks/useGoogleDriveSync.js`
**Purpose**: Complete Google Drive integration

**Returns**:
```javascript
{
  isInitialized: boolean,    // Google API loaded
  isAuthenticated: boolean,   // User signed in
  syncStatus: string,         // 'idle'|'syncing'|'success'|'error'
  lastSyncTime: number,       // Timestamp
  error: string,              // Error message
  handleAuthClick: function,  // Sign in
  handleSignOut: function,    // Sign out
  manualSync: function,       // Force sync
  triggerSync: function,      // Debounced sync
}
```

**Key Functions**:
- `initializeGapi()` - Load Google Drive API
- `initializeGIS()` - Initialize Google Identity Services
- `getOrCreateFile()` - Find or create JSON file in Drive
- `downloadFile()` - Get file content from Drive
- `uploadFile()` - Upload file content to Drive
- `syncData()` - Sync between LocalStorage and Drive

**Sync Logic**:
1. Compare `lastModified` timestamps
2. If Drive is newer → download and update local
3. If local is newer → upload to Drive
4. Auto-sync triggered on data changes (debounced)

### State Management

#### `src/store/useTaskStore.js`
**Purpose**: Zustand store for task state

**State Structure**:
```javascript
{
  tasks: {
    Monday: [{ id, text, completed, createdAt }, ...],
    Tuesday: [...],
    // ... other days
  },
  lastModified: 1234567890,
}
```

**Actions**:
- `addTask(day, text)` - Create new task
- `updateTask(day, taskId, updates)` - Modify task
- `deleteTask(day, taskId)` - Remove task
- `moveTask(taskId, fromDay, toDay, index)` - Move between days
- `reorderTask(day, startIndex, endIndex)` - Reorder within day
- `loadData(data)` - Load from external source (Drive)
- `getAllData()` - Export all data for sync

**Persistence**: Automatically saves to LocalStorage on every change

### Configuration

#### `src/config/constants.js`
**Purpose**: Centralized configuration

**Constants**:
- `GOOGLE_CONFIG` - Google API credentials and settings
- `STORAGE_KEY` - LocalStorage key name
- `DAYS_OF_WEEK` - Array of day names
- `SYNC_DELAY` - Debounce delay for auto-sync (2 seconds)

## 🔄 Data Flow

### Adding a Task
```
User clicks "Add Task" in DayColumn
  ↓
DayColumn calls onAddTask()
  ↓
WeekView calls useTaskStore.addTask()
  ↓
Store updates state + saves to LocalStorage
  ↓
WeekView calls onDataChange()
  ↓
App calls triggerSync() (debounced)
  ↓
After 2 seconds → uploadFile() to Google Drive
  ↓
Sync status updated in Header
```

### Drag and Drop
```
User drags TaskCard
  ↓
Draggable (from @hello-pangea/dnd) provides drag state
  ↓
User drops in DayColumn
  ↓
Droppable triggers onDragEnd in WeekView
  ↓
WeekView determines: moveTask() or reorderTask()
  ↓
Store updates state + LocalStorage
  ↓
Triggers sync to Google Drive
```

### Initial Sync
```
App mounts
  ↓
useGoogleDriveSync initializes Google API
  ↓
User clicks "Connect to Google Drive"
  ↓
Google OAuth flow → get access token
  ↓
Call syncData()
  ↓
Check if my_weektodo_data.json exists
  ↓
If exists: download and compare timestamps
  ↓
If Drive newer: loadData() into store
  ↓
If local newer: uploadFile() to Drive
  ↓
Set isAuthenticated = true
  ↓
Future changes auto-sync
```

## 🎯 Component Hierarchy

```
App
├── Header
│   ├── Sync Status Indicator
│   ├── Manual Sync Button
│   └── Connect/Disconnect Button
│
└── WeekView (DragDropContext)
    └── 7 × DayColumn (Droppable)
        └── N × TaskCard (Draggable)
            ├── Checkbox
            ├── Text (editable)
            └── Delete Button
```

## 🔧 Build Process

### Development
```
npm run dev
  ↓
Vite starts dev server (port 3000)
  ↓
Hot Module Replacement (HMR) enabled
  ↓
Tailwind JIT compilation
  ↓
React Fast Refresh
```

### Production Build
```
npm run build
  ↓
Vite bundles application
  ↓
Tailwind purges unused styles
  ↓
Assets optimized and minified
  ↓
Output to /dist folder
  ↓
Ready for static hosting
```

### Docker Build
```
docker build
  ↓
Stage 1: Node builder
  - npm ci (install dependencies)
  - npm run build
  ↓
Stage 2: Nginx production
  - Copy /dist files
  - Copy nginx.conf
  - Expose port 80
  ↓
Final image (~50MB)
```

## 📊 Dependencies Overview

### Production Dependencies
- `react` & `react-dom` - UI framework
- `zustand` - State management (3KB)
- `@hello-pangea/dnd` - Drag and drop
- `date-fns` - Date utilities (tree-shakeable)

### Development Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - Utility-first CSS
- `autoprefixer` & `postcss` - CSS processing
- `eslint` - Code linting

### External Scripts (CDN)
- `https://accounts.google.com/gsi/client` - Google Sign-In
- Google Drive API v3 (loaded dynamically)

## 🚀 Performance Considerations

### Bundle Size
- Main bundle: ~150KB (gzipped)
- Vendor chunk: ~40KB (React)
- Total initial load: ~190KB

### Optimization Techniques
1. **Code Splitting**: Vite automatic chunking
2. **Tree Shaking**: Unused code removed
3. **Tailwind Purging**: Only used classes included
4. **Lazy Loading**: Components loaded on demand
5. **Debounced Sync**: Prevents excessive API calls
6. **LocalStorage First**: Instant app load

### Caching Strategy
- Static assets: 1 year cache
- HTML: No cache (for updates)
- API responses: Not cached (real-time data)

## 🔐 Security Architecture

### Client-Side Only
- No backend server = no server vulnerabilities
- All processing in browser
- No data passes through third parties

### Google OAuth Flow
1. User clicks "Connect"
2. Redirect to Google Sign-In
3. User authorizes app
4. Receive access token
5. Token stored in memory (not localStorage)
6. Token used for Drive API calls

### Minimal Permissions
- Scope: `drive.file` only
- Can only access files it creates
- Cannot read other Drive files
- User can revoke anytime

## 📈 Scalability Notes

### Data Limits
- LocalStorage: ~5-10MB (browser dependent)
- Google Drive file: No practical limit for JSON
- Recommended: < 1000 tasks per week for performance

### Concurrent Editing
- Single user app (no multi-user support)
- Last write wins (Drive timestamps used)
- Future: Could add conflict resolution

### API Quotas (Google Drive Free Tier)
- 1 billion queries per day
- More than sufficient for personal use
- Each sync = 2-3 API calls

## 🎨 Styling Architecture

### Tailwind Utility Classes
- Most styling inline with utility classes
- Custom dark theme in `tailwind.config.js`
- Minimal custom CSS in `index.css`

### Responsive Design
- Mobile-first approach
- Horizontal scroll on mobile for week view
- Touch-friendly interactions
- Min-width: 320px

### Dark Mode
- Forced dark mode (class="dark" on HTML)
- Could be made toggleable
- Custom color palette for consistency

## 🧪 Testing Recommendations

### Manual Testing Checklist
- [ ] Add task to each day
- [ ] Edit task text
- [ ] Mark tasks complete/incomplete
- [ ] Delete tasks
- [ ] Drag task within same day
- [ ] Drag task to different day
- [ ] Connect to Google Drive
- [ ] Verify file created in Drive
- [ ] Sync status indicators
- [ ] Manual sync button
- [ ] Disconnect from Drive
- [ ] Refresh page (data persists)

### Future Automated Testing
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright or Cypress
- API mocking: Mock Service Worker

## 📦 Deployment Options

### Static Hosting (Easiest)
- Vercel: `vercel deploy`
- Netlify: Drag & drop /dist folder
- GitHub Pages: Push dist to gh-pages branch
- Cloudflare Pages: Connect repo

### Docker (Recommended for Self-Hosting)
- Run on any server with Docker
- Use docker-compose for easy management
- Reverse proxy with Traefik/Caddy for HTTPS

### Traditional Server
- Build: `npm run build`
- Copy /dist to web server
- Configure Nginx/Apache for SPA routing
- Enable HTTPS (required for OAuth)

## 🔮 Future Enhancements

### Potential Features
- [ ] Multiple week views (past/future weeks)
- [ ] Task templates and recurring tasks
- [ ] Categories/tags with colors
- [ ] Search and filter
- [ ] Export to PDF/ICS
- [ ] Dark/light mode toggle
- [ ] Keyboard shortcuts
- [ ] Mobile native app (React Native)
- [ ] Collaboration features
- [ ] Task time estimates
- [ ] Progress analytics

### Technical Improvements
- [ ] Service Worker for offline support
- [ ] IndexedDB as alternative to LocalStorage
- [ ] Optimistic UI updates
- [ ] Better error boundaries
- [ ] Accessibility improvements (ARIA labels)
- [ ] Internationalization (i18n)
- [ ] TypeScript migration
- [ ] Unit and E2E tests

---

**This structure prioritizes simplicity, privacy, and self-hosting capabilities while maintaining a clean, maintainable codebase.**

