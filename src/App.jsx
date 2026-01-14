import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { TaskSummary } from './components/TaskSummary';
import { CalendarView } from './components/CalendarView';
import { Timer } from './components/Timer';
import { BottomNav } from './components/BottomNav';
import { useGoogleDriveSync } from './hooks/useGoogleDriveSync';
import { useTaskStore } from './store/useTaskStore';

function App() {
  const [viewMode, setViewMode] = useState('week'); // 'week', 'calendar', or 'summary' - default to week
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

      <main className="py-4 sm:py-6 pb-24 sm:pb-28">
        <div className="mb-3 sm:mb-4 px-3 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
              {viewMode === 'week' && 'Week View'}
              {viewMode === 'calendar' && 'Calendar View'}
              {viewMode === 'summary' && 'Week Summary'}
            </h2>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400">
            {isAuthenticated 
              ? '✓ Auto-syncs every 8 hours • Click sync to update now'
              : '⚠️ Connect Drive for cloud sync'
            }
          </p>
        </div>

        {viewMode === 'week' && (
          <WeekView 
            onDataChange={trackLocalChange} 
            onTaskSelectForTimer={setSelectedTaskForTimer}
          />
        )}

        {viewMode === 'calendar' && (
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
        )}

        {viewMode === 'summary' && (
          <TaskSummary tasks={tasks} />
        )}
      </main>

      {/* iOS-style Bottom Navigation */}
      <BottomNav currentView={viewMode} onViewChange={setViewMode} />

    </div>
  );
}

export default App;

