// Google Drive API Configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE',
  SCOPES: 'https://www.googleapis.com/auth/drive.file',
  DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  FILE_NAME: 'my_weektodo_data.json',
  MIME_TYPE: 'application/json',
  FOLDER_NAME: 'wurk2do-tasks', // Folder in Drive where the JSON file will live
};

// LocalStorage key
export const STORAGE_KEY = 'week2do_data';

// Days of the week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

// Sync settings
export const SYNC_DELAY = 2000; // Debounce for multiple quick changes (ms)
export const AUTO_SYNC_INTERVAL = 8 * 60 * 60 * 1000; // Auto-sync every 8 hours (28800000ms)

