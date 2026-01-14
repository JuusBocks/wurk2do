import { useState } from 'react';
import { DAYS_OF_WEEK } from '../config/constants';
import { format, startOfWeek, addDays, isToday as isTodayFn } from 'date-fns';

const TIME_SLOTS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

// Height per hour in pixels
const HOUR_HEIGHT = 60;

// Convert time slot to hour (0-23)
const timeSlotToHour = (timeSlot) => {
  const match = timeSlot.match(/(\d+)\s*(AM|PM)/);
  if (!match) return 6;
  let hour = parseInt(match[1]);
  const period = match[2];
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  return hour;
};

// Convert hour back to time slot string
const hourToTimeSlot = (hour) => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

export const CalendarView = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onTaskSelectForTimer }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  const weekDates = DAYS_OF_WEEK.map((_, index) => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return addDays(start, index);
  });

  const handleSlotClick = (day, timeSlot) => {
    setSelectedSlot({ day, timeSlot });
    setNewTaskText('');
    setNewTaskDuration(1);
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && selectedSlot) {
      const taskText = `${selectedSlot.timeSlot} - ${newTaskText.trim()}`;
      onAddTask(selectedSlot.day, taskText);
      
      // If duration is set, update the task with estimated hours
      if (newTaskDuration > 0) {
        // We'll need to update it after adding
        // The task store will generate an ID, so we'll update in the next render cycle
        setTimeout(() => {
          const dayTasks = tasks[selectedSlot.day] || [];
          const newTask = dayTasks.find(t => t.text === taskText);
          if (newTask) {
            onUpdateTask(selectedSlot.day, newTask.id, { estimatedHours: newTaskDuration });
          }
        }, 100);
      }
      
      setSelectedSlot(null);
      setNewTaskText('');
      setNewTaskDuration(1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setSelectedSlot(null);
      setNewTaskText('');
      setNewTaskDuration(1);
    }
  };

  // Parse task to get start time and duration
  const parseTask = (task) => {
    // Extract time from task text (e.g., "9 AM - Task name")
    const timeMatch = task.text.match(/^(\d+\s*(?:AM|PM))/);
    const startTime = timeMatch ? timeMatch[1].trim() : '9 AM';
    const startHour = timeSlotToHour(startTime);
    const duration = task.estimatedHours || 1;
    const taskName = task.text.replace(/^\d+\s*(?:AM|PM)\s*-\s*/, '');
    
    return {
      startHour,
      duration,
      taskName,
      startTime
    };
  };

  // Check if two tasks overlap in time
  const tasksOverlap = (task1, task2) => {
    const end1 = task1.startHour + task1.duration;
    const end2 = task2.startHour + task2.duration;
    return task1.startHour < end2 && task2.startHour < end1;
  };

  // Get tasks positioned for rendering with overlap detection
  const getPositionedTasks = (day) => {
    const dayTasks = tasks[day] || [];
    
    // Parse all tasks with their time info
    const parsedTasks = dayTasks.map(task => {
      const { startHour, duration, taskName } = parseTask(task);
      const top = startHour * HOUR_HEIGHT; // 12 AM (0) is our starting hour
      const height = duration * HOUR_HEIGHT;
      
      return {
        ...task,
        top,
        height,
        startHour,
        duration,
        taskName,
        column: 0,
        totalColumns: 1
      };
    });

    // Sort by start time, then by duration (longer first)
    const sortedTasks = [...parsedTasks].sort((a, b) => {
      if (a.startHour !== b.startHour) return a.startHour - b.startHour;
      return b.duration - a.duration;
    });

    // Detect overlaps and assign columns
    sortedTasks.forEach((task, index) => {
      // Find all tasks that overlap with this one
      const overlapping = sortedTasks.filter((other, otherIndex) => {
        if (index === otherIndex) return false;
        return tasksOverlap(task, other);
      });

      if (overlapping.length > 0) {
        // Find which columns are already taken by overlapping tasks
        const usedColumns = new Set();
        overlapping.forEach(other => {
          if (other.column !== undefined) {
            usedColumns.add(other.column);
          }
        });

        // Assign to the first available column
        let column = 0;
        while (usedColumns.has(column)) {
          column++;
        }
        task.column = column;

        // Calculate total columns needed for this overlap group
        const maxColumn = Math.max(
          column,
          ...overlapping.map(t => t.column || 0)
        );
        const totalColumns = maxColumn + 1;

        // Update totalColumns for all tasks in this overlap group
        task.totalColumns = totalColumns;
        overlapping.forEach(other => {
          if (other.totalColumns < totalColumns) {
            other.totalColumns = totalColumns;
          }
        });
      }
    });

    return sortedTasks;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 3: return 'bg-red-500/90 border-red-500 text-red-50 hover:bg-red-500';
      case 2: return 'bg-orange-500/90 border-orange-500 text-orange-50 hover:bg-orange-500';
      case 1: return 'bg-yellow-500/90 border-yellow-500 text-yellow-900 hover:bg-yellow-500';
      default: return 'bg-blue-500/90 border-blue-500 text-blue-50 hover:bg-blue-500';
    }
  };

  const handleDurationChange = (day, taskId, newDuration) => {
    if (newDuration >= 0.5 && newDuration <= 12) {
      onUpdateTask(day, taskId, { estimatedHours: newDuration });
    }
  };

  const handleTaskClick = (day, task, e) => {
    // Don't edit if clicking buttons
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
      return;
    }
    setEditingTask({ day, id: task.id });
    setEditText(task.taskName);
  };

  const handleEditSave = (day, taskId) => {
    if (editText.trim()) {
      // Get the task to preserve its start time
      const dayTasks = tasks[day] || [];
      const task = dayTasks.find(t => t.id === taskId);
      const { startTime } = parseTask(task);
      
      // Update with new text but keep the time prefix
      const newFullText = `${startTime} - ${editText.trim()}`;
      onUpdateTask(day, taskId, { text: newFullText });
    }
    setEditingTask(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleEditKeyDown = (e, day, taskId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave(day, taskId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const togglePriority = (day, taskId, currentPriority) => {
    const priorities = [0, 1, 2, 3]; // none, low, medium, high
    const currentIndex = priorities.indexOf(currentPriority || 0);
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
    onUpdateTask(day, taskId, { priority: nextPriority });
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
            <div className="grid grid-cols-8 border-b border-dark-border sticky top-0 z-10 bg-dark-bg">
              <div className="p-2 border-r border-dark-border sticky left-0 bg-dark-bg z-20">
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

            {/* Time Grid with Positioned Tasks */}
            <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto relative">
              <div className="grid grid-cols-8">
                {/* Time Labels Column */}
                <div className="sticky left-0 z-10 bg-dark-bg border-r border-dark-border">
                  {TIME_SLOTS.map((timeSlot) => (
                    <div 
                      key={timeSlot} 
                      className="p-2 text-xs text-gray-500 border-b border-dark-border"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    >
                      {timeSlot}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {DAYS_OF_WEEK.map((day, dayIndex) => {
                  const isToday = isTodayFn(weekDates[dayIndex]);
                  const positionedTasks = getPositionedTasks(day);

                  return (
                    <div 
                      key={day}
                      className={`relative border-r border-dark-border ${isToday ? 'bg-blue-500/5' : ''}`}
                    >
                      {/* Hour Grid Lines */}
                      {TIME_SLOTS.map((timeSlot, slotIndex) => {
                        const isSelected = selectedSlot?.day === day && selectedSlot?.timeSlot === timeSlot;
                        
                        return (
                          <div
                            key={timeSlot}
                            onClick={() => handleSlotClick(day, timeSlot)}
                            className={`
                              border-b border-dark-border cursor-pointer
                              hover:bg-dark-hover active:bg-dark-border transition-colors
                              ${isSelected ? 'bg-blue-500/20 ring-2 ring-inset ring-blue-500' : ''}
                            `}
                            style={{ height: `${HOUR_HEIGHT}px` }}
                          >
                            {/* Add Task Form */}
                            {isSelected && (
                              <div className="p-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={newTaskText}
                                  onChange={(e) => setNewTaskText(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Task name..."
                                  className="w-full bg-dark-bg border border-blue-500 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none mb-1"
                                  autoFocus
                                />
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={newTaskDuration}
                                    onChange={(e) => setNewTaskDuration(parseFloat(e.target.value) || 1)}
                                    min="0.5"
                                    max="12"
                                    step="0.5"
                                    className="w-16 bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xs text-gray-200"
                                  />
                                  <span className="text-xs text-gray-400">hours</span>
                                  <button
                                    onClick={handleAddTask}
                                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Positioned Tasks */}
                      {positionedTasks.map(task => {
                        const isEditing = editingTask?.day === day && editingTask?.id === task.id;
                        
                        // Calculate horizontal position for overlapping tasks
                        const columnWidth = 100 / task.totalColumns;
                        const leftPercent = task.column * columnWidth;
                        const widthPercent = columnWidth;
                        
                        return (
                          <div
                            key={task.id}
                            className={`
                              absolute p-2 rounded border-l-4 shadow-md
                              transition-all cursor-pointer group
                              ${getPriorityColor(task.priority || 0)}
                              ${task.completed ? 'opacity-50' : 'opacity-100'}
                              ${isEditing ? 'ring-2 ring-white ring-offset-1' : ''}
                              ${task.totalColumns > 1 ? 'shadow-lg' : ''}
                            `}
                            style={{
                              top: `${task.top}px`,
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              height: `${Math.max(task.height - 2, HOUR_HEIGHT * 0.5)}px`,
                              minHeight: '40px',
                              paddingLeft: task.totalColumns > 1 ? '4px' : '8px',
                              paddingRight: task.totalColumns > 1 ? '4px' : '8px',
                            }}
                            onClick={(e) => handleTaskClick(day, task, e)}
                          >
                            {/* Task Header */}
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateTask(day, task.id, { completed: !task.completed });
                                }}
                                className={`
                                  flex-shrink-0 font-bold hover:scale-110 transition-transform
                                  ${task.totalColumns > 1 ? 'text-xs' : 'text-sm'}
                                `}
                                title={task.completed ? "Mark incomplete" : "Mark complete"}
                              >
                                {task.completed ? '✓' : '○'}
                              </button>
                              {task.totalColumns <= 2 && (
                                <div className="flex gap-1">
                                  {/* Priority Toggle */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePriority(day, task.id, task.priority);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all text-xs"
                                    title="Change priority"
                                  >
                                    ⭐
                                  </button>
                                  {/* Timer */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTaskSelectForTimer && onTaskSelectForTimer({ ...task, day });
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                    title="Add to timer focus list"
                                  >
                                    ⏱
                                  </button>
                                  {/* Delete */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteTask(day, task.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                    title="Delete"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Task Name - Editable */}
                            {isEditing ? (
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, day, task.id)}
                                onBlur={() => handleEditSave(day, task.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-black/40 border border-white/40 rounded px-2 py-1 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-white mb-1"
                                autoFocus
                              />
                            ) : (
                              <div 
                                className={`
                                  ${task.totalColumns > 1 ? 'text-[10px]' : 'text-xs sm:text-sm'}
                                  font-medium mb-1 
                                  ${task.completed ? 'line-through' : ''} 
                                  truncate
                                `}
                                title={`${task.taskName}${task.totalColumns > 1 ? ' (overlapping)' : ''} - Click to edit`}
                              >
                                {task.taskName}
                              </div>
                            )}

                            {/* Task Time Info */}
                            <div className={`
                              ${task.totalColumns > 1 ? 'text-[10px]' : 'text-xs'}
                              opacity-90 flex items-center 
                              ${task.totalColumns > 1 ? 'flex-col gap-0.5' : 'justify-between gap-2'}
                            `}>
                              <span className="font-mono text-[10px]">{hourToTimeSlot(task.startHour)}</span>
                              {task.totalColumns <= 2 && (
                                <span className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={task.duration}
                                    onChange={(e) => handleDurationChange(day, task.id, parseFloat(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                    min="0.5"
                                    max="12"
                                    step="0.5"
                                    className={`
                                      ${task.totalColumns > 1 ? 'w-10 text-[10px]' : 'w-12 text-xs'}
                                      bg-black/20 border border-white/20 rounded px-1 py-0.5 text-center 
                                      hover:bg-black/40 focus:bg-black/40 focus:ring-1 focus:ring-white
                                    `}
                                    title="Change duration (hours)"
                                  />
                                  <span className="text-[10px]">{task.totalColumns > 1 ? 'h' : 'hrs'}</span>
                                </span>
                              )}
                              {task.totalColumns > 2 && (
                                <span className="text-[10px]">{task.duration}h</span>
                              )}
                            </div>

                            {/* Priority Indicator */}
                            {task.priority > 0 && (
                              <div className={`absolute top-1 right-1 ${task.totalColumns > 1 ? 'text-xs' : 'text-sm'}`}>
                                {task.priority === 3 && '🔴'}
                                {task.priority === 2 && '🟠'}
                                {task.priority === 1 && '🟡'}
                              </div>
                            )}

                            {/* Edit Hint - hidden when overlapping */}
                            {!isEditing && task.totalColumns === 1 && (
                              <div className="absolute bottom-1 left-2 text-[10px] opacity-0 group-hover:opacity-60 transition-opacity">
                                Click to edit
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
