import { useState } from 'react';
import { DAYS_OF_WEEK } from '../config/constants';
import { format, startOfWeek, addDays, isToday as isTodayFn } from 'date-fns';

const TIME_SLOTS = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
  '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'
];

export const CalendarView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onTaskSelectForTimer }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');

  const weekDates = DAYS_OF_WEEK.map((_, index) => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return addDays(start, index);
  });

  const handleSlotClick = (day, timeSlot) => {
    setSelectedSlot({ day, timeSlot });
    setNewTaskText('');
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && selectedSlot) {
      onAddTask(selectedSlot.day, `${selectedSlot.timeSlot} - ${newTaskText.trim()}`);
      setSelectedSlot(null);
      setNewTaskText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setSelectedSlot(null);
      setNewTaskText('');
    }
  };

  const getTasksForSlot = (day, timeSlot) => {
    const dayTasks = tasks[day] || [];
    return dayTasks.filter(task => 
      task.text.startsWith(timeSlot) || 
      (task.estimatedHours && task.text.includes(timeSlot))
    );
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 3: return 'bg-red-500 border-red-500 text-red-50';
      case 2: return 'bg-orange-500 border-orange-500 text-orange-50';
      case 1: return 'bg-yellow-500 border-yellow-500 text-yellow-900';
      default: return 'bg-blue-500 border-blue-500 text-blue-50';
    }
  };

  return (
    <div className="mt-4 sm:mt-6 px-2 sm:px-3 md:px-6 mb-6 sm:mb-8">
      <div className="bg-dark-surface rounded-lg border border-dark-border overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-dark-border">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200">
            📅 Calendar View
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Tap a time slot to add a task
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[700px] sm:min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-dark-border sticky top-0 z-10">
              <div className="p-2 bg-dark-bg border-r border-dark-border sticky left-0">
                <span className="text-xs text-gray-500">Time</span>
              </div>
              {DAYS_OF_WEEK.map((day, index) => (
                <div 
                  key={day}
                  className={`p-2 text-center border-r border-dark-border ${
                    isTodayFn(weekDates[index]) ? 'bg-blue-500/10' : 'bg-dark-bg'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-gray-200">
                    {day.slice(0, 3)}
                  </div>
                  <div className={`text-xs ${
                    isTodayFn(weekDates[index]) ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {format(weekDates[index], 'M/d')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              {TIME_SLOTS.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-8 border-b border-dark-border">
                  {/* Time Label */}
                  <div className="p-2 text-xs text-gray-500 bg-dark-bg border-r border-dark-border sticky left-0">
                    {timeSlot}
                  </div>

                  {/* Day Cells */}
                  {DAYS_OF_WEEK.map((day, index) => {
                    const slotTasks = getTasksForSlot(day, timeSlot);
                    const isSelected = selectedSlot?.day === day && selectedSlot?.timeSlot === timeSlot;
                    const isToday = isTodayFn(weekDates[index]);

                    return (
                      <div
                        key={day}
                        onClick={() => handleSlotClick(day, timeSlot)}
                        className={`
                          p-1 min-h-[70px] sm:min-h-[60px] border-r border-dark-border cursor-pointer
                          hover:bg-dark-hover active:bg-dark-border transition-colors touch-manipulation
                          ${isToday ? 'bg-blue-500/5' : ''}
                          ${isSelected ? 'bg-blue-500/20 ring-2 ring-blue-500' : ''}
                        `}
                      >
                        {/* Existing Tasks */}
                        {slotTasks.map(task => (
                          <div
                            key={task.id}
                            className={`
                              mb-1 p-1.5 sm:p-1 rounded text-xs border touch-manipulation
                              ${getPriorityColor(task.priority || 0)}
                              ${task.completed ? 'opacity-50 line-through' : ''}
                            `}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-start gap-1">
                              <button
                                onClick={() => onUpdateTask(day, task.id, { completed: !task.completed })}
                                className="flex-shrink-0 mt-0.5 w-5 h-5 sm:w-auto sm:h-auto flex items-center justify-center touch-manipulation"
                              >
                                {task.completed ? '✓' : '○'}
                              </button>
                              <span className="flex-1 break-words text-xs sm:text-sm">
                                {task.text.replace(timeSlot + ' - ', '')}
                              </span>
                              <button
                                onClick={() => onTaskSelectForTimer && onTaskSelectForTimer(task)}
                                className="flex-shrink-0 hover:text-blue-300 w-5 h-5 flex items-center justify-center touch-manipulation"
                                title="Start timer"
                              >
                                ⏱
                              </button>
                              <button
                                onClick={() => onDeleteTask(day, task.id)}
                                className="flex-shrink-0 hover:text-red-300 w-5 h-5 flex items-center justify-center touch-manipulation"
                              >
                                ×
                              </button>
                            </div>
                            {task.estimatedHours > 0 && (
                              <div className="text-xs opacity-75 mt-0.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {task.estimatedHours}h
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Task Form */}
                        {isSelected && (
                          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={handleAddTask}
                              placeholder="Task name..."
                              className="w-full bg-dark-bg border border-blue-500 rounded px-2 py-2 sm:py-1 text-xs sm:text-sm text-gray-200 focus:outline-none touch-manipulation"
                              autoFocus
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
