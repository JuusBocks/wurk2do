# Week2Do - Privacy-Focused Weekly Planner

A self-hosted, privacy-focused weekly planner web application that uses Google Drive as a backend database. Your data stays in your own Google Drive, ensuring complete privacy and control.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.2-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)
![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)

## 🚀 Features

- **📅 Calendar & Week Views**: Toggle between calendar-style time slots and traditional weekly columns
- **✅ Task Management**: Add, edit, delete, and mark tasks as completed
- **⭐ Priority Levels**: High, Medium, Low priority with visual indicators and auto-sorting
- **⏱️ Pomodoro Timer**: Built-in adjustable timer with focus mode for task-based time tracking
- **🎯 Drag & Drop**: Move tasks between days effortlessly
- **⏰ Estimated Hours**: Assign and track estimated time for each task
- **📊 Task Summary**: Comprehensive list view of all tasks with priority and completion status
- **☁️ Google Drive Sync**: Automatic cloud synchronization (every 8 hours) with your Google Drive
- **💾 Local-First**: Instant loading from LocalStorage, works offline
- **📱 PWA Support**: Install on iPhone home screen, works like a native app
- **🌙 Dark Mode**: Beautiful, minimalist dark theme optimized for mobile
- **🔒 Privacy-Focused**: Your data stays in YOUR Google Drive
- **🐳 Self-Hostable**: Easy deployment with Docker

## 🏗️ Architecture

```
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation with sync status
│   │   ├── WeekView.jsx         # Main week layout
│   │   ├── DayColumn.jsx        # Individual day column
│   │   └── TaskCard.jsx         # Task item component
│   ├── hooks/
│   │   └── useGoogleDriveSync.js  # Google Drive integration
│   ├── store/
│   │   └── useTaskStore.js      # Zustand state management
│   ├── config/
│   │   └── constants.js         # Configuration constants
│   ├── App.jsx                  # Main application
│   └── main.jsx                 # Entry point
├── Dockerfile                   # Docker build configuration
├── docker-compose.yml           # Docker Compose setup
└── nginx.conf                   # Nginx configuration
```

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with Drive API enabled
- (Optional) Docker for containerized deployment

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd week2do
npm install
```

### 2. Configure Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**
4. Create credentials:
   - **API Key**: For Drive API access
   - **OAuth 2.0 Client ID**: For user authentication
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production domain (e.g., `https://yourdomain.com`)

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The app will be available at `http://localhost:8080`

### Using Docker Directly

```bash
# Build
docker build -t week2do .

# Run
docker run -d -p 8080:80 --name week2do week2do

# Stop
docker stop week2do
```

## 🔧 Configuration

### Google Drive Sync

The app uses `my_weektodo_data.json` in your Google Drive to store data. The sync logic:

1. **Initial Load**: Data loads instantly from LocalStorage
2. **Connection**: When you connect to Google Drive, it checks for existing data
3. **Conflict Resolution**: If Drive data is newer, it updates local. Otherwise, local data is uploaded.
4. **Auto-Sync**: Changes are automatically synced to Drive after a 2-second debounce

### Customization

Edit `src/config/constants.js` to customize:

```javascript
export const GOOGLE_CONFIG = {
  FILE_NAME: 'my_weektodo_data.json',  // Change filename
  SCOPES: '...',                        // Modify permissions
};

export const SYNC_DELAY = 2000;         // Sync debounce delay (ms)
```

## 🎨 UI Customization

The app uses Tailwind CSS with a custom dark theme. Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f0f0f',       // Main background
        surface: '#1a1a1a',  // Card backgrounds
        border: '#2a2a2a',   // Border color
        hover: '#252525',    // Hover states
      }
    },
  },
}
```

## 🔐 Security & Privacy

- **No Backend Server**: Completely client-side, no data passes through any server
- **Your Google Drive**: Data is stored only in your personal Google Drive
- **OAuth 2.0**: Secure authentication using Google's OAuth
- **Minimal Permissions**: Only requests access to app-created files (`drive.file` scope)
- **Open Source**: Full transparency, audit the code yourself

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 📊 Data Structure

Tasks are stored in JSON format:

```json
{
  "tasks": {
    "Monday": [
      {
        "id": "task_123",
        "text": "Complete project",
        "completed": false,
        "createdAt": 1234567890
      }
    ],
    "Tuesday": [],
    ...
  },
  "lastModified": 1234567890
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [WeekToDo](https://weektodo.me/)
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- Drag and drop powered by [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- State management by [Zustand](https://github.com/pmndrs/zustand)

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for privacy-conscious users**

