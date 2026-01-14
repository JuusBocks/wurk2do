# Week2Do - Technical Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React App                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Header    │  │   WeekView   │  │   Footer    │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │  │
│  │         │                │                            │  │
│  │         └────────────────┴──────────┐                │  │
│  │                                      │                │  │
│  │  ┌───────────────────────────────────▼──────────┐    │  │
│  │  │         Zustand State Store                  │    │  │
│  │  │  { tasks: {...}, lastModified: ... }         │    │  │
│  │  └───────────────────┬──────────────────────────┘    │  │
│  │                      │                                │  │
│  │                      │                                │  │
│  └──────────────────────┼────────────────────────────────┘  │
│                         │                                   │
│         ┌───────────────┴───────────────┐                  │
│         │                               │                  │
│         ▼                               ▼                  │
│  ┌──────────────┐              ┌──────────────────┐       │
│  │ LocalStorage │              │ Google Drive API │       │
│  │ (Instant)    │◄────sync────►│ (Cloud Backup)   │       │
│  └──────────────┘              └──────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### Read Flow (App Load)

```
1. User opens app
   └─► React renders
       └─► useTaskStore initializes
           └─► Reads from LocalStorage
               └─► App displays data IMMEDIATELY
                   └─► useGoogleDriveSync loads in background
                       └─► If authenticated: check Drive
                           ├─► Drive newer? Update local
                           └─► Local newer? Upload to Drive
```

### Write Flow (User Action)

```
1. User adds/edits task
   └─► Component calls store action
       └─► Zustand updates state
           ├─► Triggers React re-render
           └─► Saves to LocalStorage
               └─► Calls onDataChange()
                   └─► triggerSync() (debounced 2s)
                       └─► After delay: Upload to Drive
                           └─► Update sync status in UI
```

## 🧩 Component Architecture

### Atomic Design Breakdown

```
Templates
└── App.jsx (Main layout)
    │
Organisms
├── Header.jsx (Navigation + Sync controls)
├── WeekView.jsx (Week container with DnD)
└── Footer.jsx (Info bar)
    │
Molecules
└── DayColumn.jsx (Day with tasks + add form)
    │
Atoms
├── TaskCard.jsx (Single task item)
├── Buttons
├── Inputs
└── Icons
```

### Component Communication

```
App (Owner of state via hooks)
 │
 ├─► Header (Display-only + event handlers)
 │    └─► Receives: status, handlers
 │    └─► Emits: connect, disconnect, sync events
 │
 └─► WeekView (Data + DnD coordinator)
      └─► Receives: sync trigger
      └─► Emits: data change events
      │
      ├─► DayColumn × 7 (Day manager)
      │    └─► Receives: tasks, handlers
      │    └─► Emits: add/update/delete events
      │    │
      │    └─► TaskCard × N (Task display)
      │         └─► Receives: task, handlers
      │         └─► Emits: update/delete events
```

## 📊 State Management Strategy

### Zustand Store Design

```javascript
// State structure
{
  // Data
  tasks: {
    Monday: [Task, Task, ...],
    Tuesday: [...],
    ...
  },
  lastModified: timestamp,
  
  // Actions (not stored, just methods)
  addTask: (day, text) => void,
  updateTask: (day, id, updates) => void,
  deleteTask: (day, id) => void,
  moveTask: (id, from, to, index) => void,
  reorderTask: (day, start, end) => void,
  loadData: (data) => void,
  getAllData: () => data,
}
```

### Why Zustand?

1. **Minimal boilerplate** - No providers, no reducers
2. **Small bundle size** - Only 3KB
3. **Direct mutations** - Simpler than Redux
4. **React-friendly** - Automatic re-renders
5. **No context** - No prop drilling needed

### State Update Pattern

```javascript
// Every action follows this pattern:
set(state => {
  // 1. Create new state
  const newState = { 
    ...state, 
    tasks: { ...modified },
    lastModified: Date.now() 
  };
  
  // 2. Persist to LocalStorage
  localStorage.setItem(KEY, JSON.stringify(newState));
  
  // 3. Return for React update
  return newState;
});
```

## 🔌 Google Drive Integration

### Authentication Flow (OAuth 2.0)

```
User clicks "Connect"
  ↓
Initialize Token Client (GIS)
  ↓
Request access token
  ↓
Google shows consent screen
  ↓
User approves
  ↓
Receive access token
  ↓
Store in memory (accessTokenRef)
  ↓
Set token in gapi client
  ↓
isAuthenticated = true
```

### File Operations

#### Search for File
```javascript
gapi.client.drive.files.list({
  q: "name='my_weektodo_data.json' and trashed=false",
  fields: 'files(id, name, modifiedTime)',
  spaces: 'drive',
})
```

#### Create File
```javascript
gapi.client.drive.files.create({
  resource: {
    name: 'my_weektodo_data.json',
    mimeType: 'application/json',
  },
  fields: 'id, name, modifiedTime',
})
```

#### Download File
```javascript
gapi.client.drive.files.get({
  fileId: fileId,
  alt: 'media',
})
```

#### Upload File (Multipart)
```javascript
fetch('https://www.googleapis.com/upload/drive/v3/files/' + fileId, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'multipart/related; boundary=...',
  },
  body: multipartRequestBody,
})
```

### Sync Strategy

```
┌─────────────────────────────────────────┐
│         Sync Decision Tree              │
├─────────────────────────────────────────┤
│                                          │
│  File exists in Drive?                  │
│  ├─ No: Create + upload local data      │
│  └─ Yes: Compare timestamps             │
│      ├─ Drive newer: Download + replace │
│      │                local              │
│      └─ Local newer: Upload to Drive    │
│                                          │
│  Conflict Resolution: Last write wins   │
│                                          │
└─────────────────────────────────────────┘
```

### Debouncing Strategy

```javascript
// Why debounce?
// User types fast → many state changes → avoid 100 API calls

let timeout;
function debouncedSync() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    actualSync(); // Only called after user stops for 2 seconds
  }, 2000);
}
```

## 🎨 Styling Architecture

### Tailwind Utility-First Approach

```
Base Layer (@layer base)
├─ Reset styles
└─ Global body styles

Components Layer (@layer components)
└─ Reusable component classes (if needed)

Utilities Layer (@layer utilities)
├─ Custom scrollbar
└─ Animation utilities
```

### Custom Theme

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f0f0f',       // Darkest (body)
        surface: '#1a1a1a',  // Cards
        border: '#2a2a2a',   // Borders
        hover: '#252525',    // Hover states
      }
    }
  }
}
```

### Responsive Design Strategy

```
Mobile First (default)
├─ Base styles: mobile (320px+)
├─ sm: 640px (tablet)
├─ md: 768px (desktop)
├─ lg: 1024px (large desktop)
└─ xl: 1280px (extra large)

Week2Do approach:
- Default: Single column scroll
- All sizes: Horizontal week scroll
- Focus: Touch-friendly interactions
```

## 🔄 Drag and Drop Architecture

### @hello-pangea/dnd Structure

```
<DragDropContext onDragEnd={handleDragEnd}>
  └─► Droppable (id="Monday")
       └─► Draggable (id="task_123", index=0)
            └─► TaskCard content

       └─► Draggable (id="task_456", index=1)
            └─► TaskCard content
            
  └─► Droppable (id="Tuesday")
       └─► Draggable (id="task_789", index=0)
            └─► TaskCard content
```

### Drag Event Handling

```javascript
function handleDragEnd(result) {
  const { source, destination, draggableId } = result;
  
  // Dropped outside
  if (!destination) return;
  
  // No change
  if (source.droppableId === destination.droppableId &&
      source.index === destination.index) return;
  
  // Same day = reorder
  if (source.droppableId === destination.droppableId) {
    reorderTask(source.droppableId, source.index, destination.index);
  }
  // Different day = move
  else {
    moveTask(draggableId, source.droppableId, 
             destination.droppableId, destination.index);
  }
  
  // Trigger sync
  triggerSync();
}
```

## 🚀 Build & Deploy Architecture

### Development Build

```
Source Files
  ↓
Vite Dev Server
  ├─► Hot Module Replacement (HMR)
  ├─► Fast Refresh (React)
  ├─► On-demand compilation
  └─► Tailwind JIT mode
      ↓
http://localhost:3000
```

### Production Build

```
Source Files
  ↓
Vite Build Process
  ├─► Rollup bundling
  ├─► Code splitting
  ├─► Minification
  ├─► Tree shaking
  └─► Tailwind purge
      ↓
/dist folder
  ├─── index.html
  ├─── assets/
  │    ├── index-[hash].js
  │    ├── index-[hash].css
  │    └── vendor-[hash].js
  └─── [static files]
```

### Docker Multi-Stage Build

```
Stage 1: Builder (node:20-alpine)
├─ Copy package files
├─ npm ci (clean install)
├─ Copy source
└─ npm run build → /app/dist

Stage 2: Production (nginx:alpine)
├─ Copy nginx.conf
├─ Copy /app/dist → /usr/share/nginx/html
├─ Expose port 80
└─ Start nginx

Result: ~50MB image (vs ~500MB with Node)
```

## 🔒 Security Architecture

### Client-Side Only Benefits

```
Traditional Architecture:
User → Frontend → Backend → Database
      ↑ Can be intercepted
      ↑ Server can log data
      ↑ Requires trust in service

Week2Do Architecture:
User → Frontend → Google Drive (user's own)
      ↑ Direct connection
      ↑ No middleman
      ↑ User controls data
```

### OAuth Token Management

```javascript
// Token lifecycle
1. Request token (user consent)
2. Receive access token
3. Store in memory only (tokenRef)
   ├─ NOT in localStorage (XSS risk)
   └─ NOT in sessionStorage
4. Use for API calls
5. Token expires after 1 hour
6. User must re-authenticate
```

### Permissions Model

```
Requested scope: https://www.googleapis.com/auth/drive.file

What this ALLOWS:
✓ Create new files
✓ Read files created by this app
✓ Update files created by this app
✓ Delete files created by this app

What this DENIES:
✗ Read other Drive files
✗ Access to existing documents
✗ Full Drive access
```

## 📈 Performance Architecture

### Load Performance

```
Time to Interactive (TTI)
├─ 0ms: HTML loaded
├─ 50ms: CSS parsed
├─ 100ms: React hydrated
├─ 150ms: LocalStorage read
├─ 200ms: First paint with data ✓
└─ Background: Google API loads
```

### Optimization Techniques

1. **Lazy Loading**
   ```javascript
   // Components loaded on demand
   const LazyComponent = lazy(() => import('./Component'));
   ```

2. **Memoization**
   ```javascript
   // Prevent unnecessary re-renders
   const memoizedValue = useMemo(() => compute(), [deps]);
   ```

3. **Debouncing**
   ```javascript
   // Reduce API calls
   const debouncedFn = debounce(fn, 2000);
   ```

4. **Bundle Splitting**
   ```javascript
   // Vite automatically splits
   // vendor.js, main.js, etc.
   ```

### Runtime Performance

```
State Updates
├─ Zustand: O(1) updates
├─ React: Reconciliation
├─ DOM: Minimal updates (Virtual DOM)
└─ Result: 60fps smooth

Drag & Drop
├─ CSS transforms (GPU accelerated)
├─ No layout thrashing
└─ Result: Smooth dragging

Sync Operations
├─ Debounced (2s)
├─ Background (non-blocking)
└─ Result: No UI jank
```

## 🧪 Testing Strategy (Future)

### Recommended Test Pyramid

```
         E2E Tests
        (Playwright)
       /           \
      /   5-10%     \
     /_______________\
    Integration Tests
    (React Testing Lib)
   /                 \
  /      20-30%       \
 /______________________\
      Unit Tests
       (Jest)
    /              \
   /     70%        \
  /___________________\
```

### Test Coverage Goals

```
Component Tests
├─ TaskCard: Add, edit, delete, complete
├─ DayColumn: Add task, render tasks
├─ WeekView: Drag and drop, date calc
└─ Header: Sync status display

Hook Tests
├─ useGoogleDriveSync: Auth, sync logic
└─ useTaskStore: CRUD operations

Integration Tests
├─ Full user flow: Add → Edit → Drag → Delete
└─ Sync flow: Local → Drive → Local

E2E Tests
├─ Happy path: Install → Connect → Use
└─ Error paths: No connection, API fails
```

## 📊 Monitoring & Observability (Future)

### Recommended Metrics

```
User Metrics
├─ Time to first task
├─ Tasks created per session
└─ Drag operations per session

Performance Metrics
├─ Time to Interactive (TTI)
├─ First Contentful Paint (FCP)
└─ Largest Contentful Paint (LCP)

Reliability Metrics
├─ Sync success rate
├─ API error rate
└─ LocalStorage failures

Could use:
├─ Google Analytics (privacy-friendly mode)
├─ Plausible (open-source alternative)
└─ Self-hosted Matomo
```

## 🔮 Architecture Evolution

### Current: V1.0 (MVP)
```
Single user, local-first, Drive backup
```

### Future: V1.5
```
├─ Service Worker (offline mode)
├─ IndexedDB (better storage)
├─ PWA support
└─ Better error handling
```

### Future: V2.0
```
├─ Multiple week views
├─ Recurring tasks
├─ Categories/tags
└─ Search functionality
```

### Future: V3.0 (Maybe)
```
├─ Real-time collaboration
├─ WebSockets for sync
├─ Conflict resolution UI
└─ Team features
```

---

**This architecture prioritizes:**
- 🚀 Performance (local-first)
- 🔒 Privacy (no backend)
- 🎯 Simplicity (minimal dependencies)
- 📦 Maintainability (clear structure)

