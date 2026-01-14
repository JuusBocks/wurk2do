import { useState, useEffect, useRef } from 'react';

export const Timer = ({ selectedTasks = [], onTaskComplete, onClearTasks, compact = false }) => {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playSound = () => {
    // Play a beep sound when timer completes
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (!isRunning) {
      setTimeLeft(newDuration * 60);
    }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const completedCount = selectedTasks.filter(t => t.completed).length;
  const totalTasks = selectedTasks.length;

  // Compact view (for top of app)
  if (compact && !isFocusMode) {
    return (
      <div className="bg-dark-surface border-b border-dark-border px-3 sm:px-6 py-3">
        <div className="flex items-start justify-between gap-4">
          {/* Timer Display + Mini Checklist */}
          <div className="flex-1 flex items-start gap-3">
            <div className="relative mt-1">
              {/* Circular Progress */}
              <svg className="w-12 h-12 sm:w-14 sm:h-14 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  className={`transition-all ${isRunning ? 'text-blue-500' : 'text-gray-500'}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-200">
                {minutes}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-lg sm:text-xl font-mono font-bold text-gray-200">
                    {formatTime(timeLeft)}
                  </div>
                  {totalTasks > 0 && (
                    <div className="text-xs text-gray-400">
                      {completedCount}/{totalTasks} tasks
                    </div>
                  )}
                </div>

                {totalTasks > 0 && (
                  <button
                    onClick={() => setIsFocusMode(true)}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors"
                    title="Open fullscreen focus mode"
                  >
                    ⛶
                    <span>Focus</span>
                  </button>
                )}
              </div>

              {/* Mini task checklist (top bar) */}
              {totalTasks > 0 && (
                <div className="mt-2 max-h-20 overflow-y-auto pr-1 space-y-1">
                  {selectedTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-[11px] text-gray-300"
                    >
                      <button
                        onClick={() => onTaskComplete && onTaskComplete(task.day, task.id)}
                        className={`
                          flex-shrink-0 w-4 h-4 rounded border-2 transition-all
                          ${task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-500 hover:border-green-400 active:border-green-500'}
                        `}
                      >
                        {task.completed && (
                          <svg
                            className="w-full h-full text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 truncate">
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.text}
                        </span>
                      </div>
                    </div>
                  ))}
                  {totalTasks > 3 && (
                    <button
                      onClick={() => setIsFocusMode(true)}
                      className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      + View all {totalTasks} tasks
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-1">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="p-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg transition-colors touch-manipulation"
                title="Start timer"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg transition-colors touch-manipulation"
                title="Pause timer"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2 bg-dark-bg hover:bg-dark-hover active:bg-dark-border rounded-lg transition-colors touch-manipulation"
              title="Reset timer"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {totalTasks > 0 && (
              <button
                onClick={() => setIsFocusMode(true)}
                className="p-2 bg-dark-bg hover:bg-dark-hover active:bg-dark-border rounded-lg transition-colors touch-manipulation sm:hidden"
                title="Focus mode"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Focus Mode (full screen)
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col items-center justify-center p-6 overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsFocusMode(false)}
          className="absolute top-4 right-4 p-3 bg-dark-surface hover:bg-dark-hover rounded-full transition-colors touch-manipulation z-10"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Task List */}
        {totalTasks > 0 && (
          <div className="mb-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">
                Focus Tasks ({completedCount}/{totalTasks})
              </h3>
              {totalTasks > 0 && onClearTasks && (
                <button
                  onClick={onClearTasks}
                  className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="bg-dark-surface rounded-xl border border-dark-border p-4 max-h-60 overflow-y-auto scrollbar-thin">
              {selectedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 py-3 border-b border-dark-border last:border-b-0"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onTaskComplete && onTaskComplete(task.day, task.id)}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded border-2 transition-all touch-manipulation mt-0.5
                      ${task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-500 hover:border-green-400 active:border-green-500'
                      }
                    `}
                  >
                    {task.completed && (
                      <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm sm:text-base break-words
                      ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}
                    `}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {task.priority > 0 && (
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                          ${task.priority === 3 ? 'bg-red-500/20 text-red-400' :
                            task.priority === 2 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'}
                        `}>
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                          P{task.priority}
                        </span>
                      )}
                      {task.estimatedHours > 0 && (
                        <span className="text-xs text-blue-400">
                          {task.estimatedHours}h
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {task.day}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Large Circular Timer */}
        <div className="relative mb-12">
          <svg className="w-64 h-64 sm:w-80 sm:h-80 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-800"
            />
            {/* Progress circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 140}`}
              strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                isRunning ? 'text-blue-500' : 
                timeLeft === 0 ? 'text-green-500' : 
                'text-gray-600'
              }`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl sm:text-8xl font-mono font-bold text-gray-100 mb-2">
              {minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-5xl sm:text-6xl font-mono font-bold text-gray-400">
              {seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Duration Presets */}
        <div className="flex gap-2 mb-8">
          {[5, 15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              className={`px-4 py-2 rounded-lg transition-colors touch-manipulation ${
                duration === mins
                  ? 'bg-blue-500 text-white'
                  : 'bg-dark-surface text-gray-400 hover:bg-dark-hover'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl text-white font-semibold text-lg transition-colors touch-manipulation flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl text-white font-semibold text-lg transition-colors touch-manipulation flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-dark-surface hover:bg-dark-hover active:bg-dark-border rounded-xl text-gray-300 font-semibold text-lg transition-colors touch-manipulation flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>

        {/* Status message */}
        {timeLeft === 0 && (
          <div className="mt-8 text-2xl font-semibold text-green-400 animate-pulse">
            ✓ Time's up! Great work!
          </div>
        )}
      </div>
    );
  }

  return null;
};
