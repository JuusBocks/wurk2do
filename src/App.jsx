import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { TaskSummary } from './components/TaskSummary';
import { CalendarView } from './components/CalendarView';
import { Timer } from './components/Timer';
import { useGoogleDriveSync } from './hooks/useGoogleDriveSync';
import { useTaskStore } from './store/useTaskStore';

function App() {
  const [viewMode, setViewMode] = useState('calendar'); // 'week' or 'calendar' - default to calendar
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState(null);
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  
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

      {/* Timer Bar */}
      <Timer 
        compact={true} 
        selectedTask={selectedTaskForTimer}
        onTaskSelect={setSelectedTaskForTimer}
      />

      <main className="py-4 sm:py-6 pb-32 sm:pb-16">
        <div className="mb-3 sm:mb-4 px-3 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
              This Week
            </h2>
            
            {/* View Toggle - iOS 26 Liquid Glass Effect */}
            <div className="relative flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-lg">
              {/* Liquid Glass Slider Background */}
              <div 
                className={`
                  absolute top-1 bottom-1 w-[calc(50%-0.25rem)] 
                  bg-gradient-to-br from-blue-500/90 to-blue-600/90
                  backdrop-blur-2xl rounded-xl
                  transition-all duration-500 ease-out
                  shadow-[0_0_20px_rgba(59,130,246,0.5)]
                  ${viewMode === 'week' ? 'left-1' : 'left-[calc(50%+0.125rem)]'}
                `}
                style={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              />
              
              <button
                onClick={() => setViewMode('week')}
                className={`
                  relative z-10 px-3 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm rounded-xl 
                  transition-all duration-300 touch-manipulation font-medium
                  ${viewMode === 'week' 
                    ? 'text-white scale-[1.02]' 
                    : 'text-gray-400 hover:text-gray-200 active:scale-95'
                  }
                `}
              >
                📋 <span className="hidden xs:inline">Week</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  relative z-10 px-3 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm rounded-xl 
                  transition-all duration-300 touch-manipulation font-medium
                  ${viewMode === 'calendar' 
                    ? 'text-white scale-[1.02]' 
                    : 'text-gray-400 hover:text-gray-200 active:scale-95'
                  }
                `}
              >
                📅 <span className="hidden xs:inline">Cal</span>
              </button>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400">
            {isAuthenticated 
              ? '✓ Auto-syncs every 8 hours • Click sync to update now'
              : '⚠️ Connect Drive for cloud sync'
            }
          </p>
        </div>

        {viewMode === 'week' ? (
          <>
            <WeekView 
              onDataChange={trackLocalChange} 
              onTaskSelectForTimer={setSelectedTaskForTimer}
            />
            <TaskSummary tasks={tasks} />
          </>
        ) : (
          <>
            <CalendarView 
              tasks={tasks}
              onAddTask={(day, text) => {
                addTask(day, text);
                trackLocalChange();
              }}
              onUpdateTask={(day, taskId, updates) => {
                updateTask(day, taskId, updates);
                trackLocalChange();
              }}
              onDeleteTask={(day, taskId) => {
                deleteTask(day, taskId);
                trackLocalChange();
              }}
              onTaskSelectForTimer={setSelectedTaskForTimer}
            />
            <TaskSummary tasks={tasks} />
            
            {/* Bottom Spacer - Ensures content is accessible on iOS */}
            <div className="h-8 sm:hidden" aria-hidden="true"></div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="hidden sm:block fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border px-6 py-2 text-xs text-gray-500 text-center" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
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

