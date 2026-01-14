import { useState, useEffect, useCallback, useRef } from 'react';
import { GOOGLE_CONFIG, SYNC_DELAY, AUTO_SYNC_INTERVAL } from '../config/constants';
import { useTaskStore } from '../store/useTaskStore';
import { encryptData, decryptData, isEncrypted, migrateToEncrypted } from '../utils/encryption';

export const useGoogleDriveSync = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [error, setError] = useState(null);
  
  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const fileIdRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const autoSyncIntervalRef = useRef(null);
  const lastLocalChangeRef = useRef(Date.now());
  const userEmailRef = useRef(null);
  
  const loadData = useTaskStore(state => state.loadData);
  const getAllData = useTaskStore(state => state.getAllData);

  // Initialize Google API
  useEffect(() => {
    const initializeGapi = () => {
      if (typeof window.gapi !== 'undefined') {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_CONFIG.API_KEY,
              discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
            });
            setIsInitialized(true);
          } catch (err) {
            console.error('Error initializing GAPI:', err);
            setError('Failed to initialize Google API');
          }
        });
      }
    };

    const initializeGIS = () => {
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          scope: GOOGLE_CONFIG.SCOPES,
          callback: '', // Will be set in handleAuthClick
        });
      }
    };

    // Wait for scripts to load
    const checkInterval = setInterval(() => {
      if (typeof window.gapi !== 'undefined' && typeof window.google !== 'undefined') {
        clearInterval(checkInterval);
        initializeGapi();
        initializeGIS();
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  // Find or create the data file in Google Drive
  const getOrCreateFile = useCallback(async () => {
    try {
      // Search for existing file
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${GOOGLE_CONFIG.FILE_NAME}' and trashed=false`,
        fields: 'files(id, name, modifiedTime)',
        spaces: 'drive',
      });

      const files = searchResponse.result.files;
      
      if (files && files.length > 0) {
        // File exists
        fileIdRef.current = files[0].id;
        return files[0];
      } else {
        // Create new file
        const createResponse = await window.gapi.client.drive.files.create({
          resource: {
            name: GOOGLE_CONFIG.FILE_NAME,
            mimeType: GOOGLE_CONFIG.MIME_TYPE,
          },
          fields: 'id, name, modifiedTime',
        });
        
        fileIdRef.current = createResponse.result.id;
        
        // Write initial empty data
        const initialData = getAllData();
        await uploadFile(createResponse.result.id, initialData);
        
        return createResponse.result;
      }
    } catch (err) {
      console.error('Error getting/creating file:', err);
      throw err;
    }
  }, [getAllData]);

  // Download file content from Google Drive
  const downloadFile = useCallback(async (fileId) => {
    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });
      
      let content = response.result;
      
      // If content is encrypted, decrypt it
      if (userEmailRef.current && typeof content === 'string' && isEncrypted(content)) {
        console.log('🔓 Decrypting data from Drive...');
        const decryptedContent = await decryptData(content, userEmailRef.current);
        content = JSON.parse(decryptedContent);
      }
      
      return content;
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  }, []);

  // Upload file content to Google Drive
  const uploadFile = useCallback(async (fileId, data) => {
    try {
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        mimeType: GOOGLE_CONFIG.MIME_TYPE,
        modifiedTime: new Date().toISOString(),
      };

      // Encrypt data before uploading if user email is available
      let contentToUpload = JSON.stringify(data);
      if (userEmailRef.current) {
        console.log('🔒 Encrypting data before upload...');
        contentToUpload = await encryptData(contentToUpload, userEmailRef.current);
      }

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + GOOGLE_CONFIG.MIME_TYPE + '\r\n\r\n' +
        contentToUpload +
        close_delim;

      const response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessTokenRef.current}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  }, []);

  // Sync data between LocalStorage and Google Drive (bidirectional)
  const syncData = useCallback(async () => {
    if (!isAuthenticated || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setError(null);

    try {
      console.log('🔄 Syncing: Checking for updates and uploading changes...');
      
      // Get or create the file
      const file = await getOrCreateFile();
      
      // Download current content from Drive
      let driveData = null;
      try {
        driveData = await downloadFile(file.id);
        console.log('📥 Downloaded data from Drive');
      } catch (err) {
        // File might be empty, use local data
        console.log('⚠️ Could not download file, using local data');
      }

      const localData = getAllData();
      
      // Sync logic: Use the most recent data
      if (driveData && driveData.lastModified && driveData.lastModified > localData.lastModified) {
        // Drive data is newer, update local
        console.log('☁️ Drive has newer data - updating local storage');
        loadData(driveData);
      } else {
        // Local data is newer or equal, upload to Drive
        console.log('📤 Local data is newer - uploading to Drive');
        await uploadFile(file.id, localData);
      }

      setSyncStatus('success');
      setLastSyncTime(Date.now());
      console.log('✅ Sync complete!');
    } catch (err) {
      console.error('❌ Sync error:', err);
      setSyncStatus('error');
      setError(err.message || 'Sync failed');
    } finally {
      isSyncingRef.current = false;
    }
  }, [isAuthenticated, getOrCreateFile, downloadFile, uploadFile, getAllData, loadData]);

  // Track local changes (no longer auto-syncs immediately)
  const trackLocalChange = useCallback(() => {
    if (!isAuthenticated) return;
    lastLocalChangeRef.current = Date.now();
  }, [isAuthenticated]);

  // Handle authentication
  const handleAuthClick = useCallback(() => {
    if (!tokenClientRef.current) {
      setError('Google Sign-In not initialized');
      return;
    }

    tokenClientRef.current.callback = async (response) => {
      if (response.error) {
        setError(response.error);
        return;
      }

      accessTokenRef.current = response.access_token;
      window.gapi.client.setToken({ access_token: response.access_token });
      
      // Get user info for encryption key derivation
      try {
        const userInfo = await window.gapi.client.request({
          path: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });
        userEmailRef.current = userInfo.result.email;
        console.log('🔑 Encryption key derived from user account');
      } catch (err) {
        console.warn('Could not get user email, encryption may not work:', err);
      }
      
      setIsAuthenticated(true);
      
      // Initial sync after authentication
      await syncData();
      
      // Start 8-hour auto-sync
      if (autoSyncIntervalRef.current) {
        clearInterval(autoSyncIntervalRef.current);
      }
      autoSyncIntervalRef.current = setInterval(() => {
        console.log('⏰ 8-hour auto-sync triggered');
        syncData();
      }, AUTO_SYNC_INTERVAL);
    };

    if (accessTokenRef.current) {
      // Already have token, get user info and sync
      try {
        const userInfo = await window.gapi.client.request({
          path: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });
        userEmailRef.current = userInfo.result.email;
        console.log('🔑 Encryption key derived from user account');
      } catch (err) {
        console.warn('Could not get user email, encryption may not work:', err);
      }
      
      setIsAuthenticated(true);
      syncData();
      
      // Start 8-hour auto-sync
      if (autoSyncIntervalRef.current) {
        clearInterval(autoSyncIntervalRef.current);
      }
      autoSyncIntervalRef.current = setInterval(() => {
        console.log('⏰ 8-hour auto-sync triggered');
        syncData();
      }, AUTO_SYNC_INTERVAL);
    } else {
      // Request new token
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    }
  }, [syncData]);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    if (accessTokenRef.current) {
      window.google.accounts.oauth2.revoke(accessTokenRef.current, () => {
        console.log('Token revoked');
      });
      accessTokenRef.current = null;
    }
    
    // Clear auto-sync interval
    if (autoSyncIntervalRef.current) {
      clearInterval(autoSyncIntervalRef.current);
      autoSyncIntervalRef.current = null;
    }
    
    window.gapi.client.setToken(null);
    setIsAuthenticated(false);
    fileIdRef.current = null;
    userEmailRef.current = null;
    setSyncStatus('idle');
    setLastSyncTime(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (autoSyncIntervalRef.current) {
        clearInterval(autoSyncIntervalRef.current);
      }
    };
  }, []);

  return {
    isInitialized,
    isAuthenticated,
    syncStatus,
    lastSyncTime,
    error,
    handleAuthClick,
    handleSignOut,
    manualSync: syncData,
    trackLocalChange, // Track changes but don't auto-sync
  };
};

