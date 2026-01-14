import { format } from 'date-fns';

export const Header = ({ 
  isAuthenticated, 
  syncStatus, 
  lastSyncTime,
  error,
  onConnect, 
  onDisconnect,
  onManualSync 
}) => {
  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'success': return lastSyncTime ? `Last: ${format(lastSyncTime, 'HH:mm')}` : 'Synced';
      case 'error': return 'Sync failed';
      default: return 'Not synced';
    }
  };

  return (
    <header className="bg-dark-surface border-b border-dark-border px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Title */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-100 truncate">wurk2do</h1>
          <p className="hidden sm:block text-sm text-gray-400">Privacy-focused weekly planner</p>
        </div>

        {/* Google Drive Status and Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Sync Status */}
          {isAuthenticated && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className={`hidden sm:flex items-center gap-2 text-sm ${getSyncStatusColor()}`}>
                {syncStatus === 'syncing' && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                {syncStatus === 'success' && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {syncStatus === 'error' && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span>{getSyncStatusText()}</span>
              </div>

              {/* Manual Sync Button */}
              <button
                onClick={onManualSync}
                disabled={syncStatus === 'syncing'}
                className="p-2 hover:bg-dark-hover active:bg-dark-border rounded transition-colors disabled:opacity-50 touch-manipulation"
                title="Sync now - upload changes and check for updates"
              >
                <svg 
                  className={`h-5 w-5 sm:h-4 sm:w-4 text-gray-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Mobile Sync Status Indicator */}
              <div className={`sm:hidden flex items-center ${getSyncStatusColor()}`}>
                {syncStatus === 'syncing' && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                {syncStatus === 'success' && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Connect/Disconnect Button */}
          {isAuthenticated ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-dark-bg hover:bg-dark-hover active:bg-dark-border border border-dark-border rounded-lg transition-colors text-xs sm:text-sm touch-manipulation"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"/>
              </svg>
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium touch-manipulation whitespace-nowrap"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3H6c-3.31 0-6-2.69-6-6s2.69-6 6-6h.71C7.37 7.69 8.48 6.8 9.8 6.27l1.46 1.46C9.5 8.23 8 9.96 8 12H6c-2.21 0-4 1.79-4 4s1.79 4 4 4h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
              <span className="hidden xs:inline sm:inline">Connect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

