import { useEffect } from 'react';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { TaskSummary } from './components/TaskSummary';
import { useGoogleDriveSync } from './hooks/useGoogleDriveSync';
import { useTaskStore } from './store/useTaskStore';

function App() {
  const tasks = useTaskStore(state => state.tasks);
  
  const {
    isInitialized,
    isAuthenticated,
    syncStatus,
    lastSyncTime,
    error,
    handleAuthClick,
    handleSignOut,
    manualSync,
    trackLocalChange,
  } = useGoogleDriveSync();

  useEffect(() => {
    // Trigger initial sync when authenticated
    if (isAuthenticated) {
      manualSync();
    }
  }, [isAuthenticated, manualSync]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing Google Drive API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        isAuthenticated={isAuthenticated}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
        error={error}
        onConnect={handleAuthClick}
        onDisconnect={handleSignOut}
        onManualSync={manualSync}
      />

      <main className="py-4 sm:py-6">
        <div className="mb-3 sm:mb-4 px-3 sm:px-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-1 sm:mb-2">
            This Week
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {isAuthenticated 
              ? '✓ Auto-syncs every 8 hours • Click sync to update now'
              : '⚠️ Connect Drive for cloud sync'
            }
          </p>
        </div>

        <WeekView onDataChange={trackLocalChange} />

        {/* Task Summary */}
        <TaskSummary tasks={tasks} />
      </main>

      {/* Footer */}
      <footer className="hidden sm:block fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border px-6 py-2 text-xs text-gray-500 text-center">
        <p>
          wurk2do - Privacy-focused weekly planner. Your data stays in your Google Drive.
          {' '}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

