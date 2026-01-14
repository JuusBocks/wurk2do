import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export const TaskCard = ({ task, index, day, onUpdate, onDelete, onStartTimer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editHours, setEditHours] = useState(task.estimatedHours || 0);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(day, task.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleHoursSave = () => {
    const hours = Math.max(0, Math.min(24, parseFloat(editHours) || 0));
    onUpdate(day, task.id, { estimatedHours: hours });
    setIsEditingHours(false);
  };

  const handleHoursKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleHoursSave();
    } else if (e.key === 'Escape') {
      setEditHours(task.estimatedHours || 0);
      setIsEditingHours(false);
    }
  };

  // Extract time from task text if it exists (e.g., "9 AM - Task name")
  const getTaskTime = () => {
    const timeMatch = task.text.match(/^(\d+\s*(?:AM|PM))/i);
    return timeMatch ? timeMatch[1].trim() : null;
  };

  // Get task text without time prefix
  const getTaskTextWithoutTime = () => {
    return task.text.replace(/^\d+\s*(?:AM|PM)\s*-\s*/i, '');
  };

  const handleTimeSelect = (time) => {
    const taskTextWithoutTime = getTaskTextWithoutTime();
    const newText = time ? `${time} - ${taskTextWithoutTime}` : taskTextWithoutTime;
    onUpdate(day, task.id, { text: newText });
    setIsEditingTime(false);
  };

  // Generate time slots (12 AM - 11 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      let displayHour = hour;
      let period = 'AM';
      
      if (hour === 0) {
        displayHour = 12;
      } else if (hour === 12) {
        period = 'PM';
      } else if (hour > 12) {
        displayHour = hour - 12;
        period = 'PM';
      }
      
      slots.push(`${displayHour} ${period}`);
    }
    return slots;
  };

  const toggleComplete = () => {
    onUpdate(day, task.id, { completed: !task.completed });
  };

  const cyclePriority = () => {
    // Cycle through: 0 (none) → 1 (low) → 2 (medium) → 3 (high) → 0
    const nextPriority = (task.priority || 0) >= 3 ? 0 : (task.priority || 0) + 1;
    onUpdate(day, task.id, { priority: nextPriority });
  };

  const getPriorityConfig = () => {
    const priority = task.priority || 0;
    switch(priority) {
      case 3: return { color: 'red', label: 'High', bgClass: 'bg-red-500/5', borderClass: 'border-red-500', textClass: 'text-red-400', fillClass: 'fill-red-500' };
      case 2: return { color: 'orange', label: 'Medium', bgClass: 'bg-orange-500/5', borderClass: 'border-orange-500', textClass: 'text-orange-400', fillClass: 'fill-orange-500' };
      case 1: return { color: 'yellow', label: 'Low', bgClass: 'bg-yellow-500/5', borderClass: 'border-yellow-500', textClass: 'text-yellow-400', fillClass: 'fill-yellow-500' };
      default: return { color: 'gray', label: 'None', bgClass: '', borderClass: 'border-dark-border', textClass: 'text-gray-600', fillClass: '' };
    }
  };

  const priorityConfig = getPriorityConfig();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group bg-dark-surface rounded-lg p-3 mb-2
            hover:border-gray-600 active:border-blue-500 transition-all duration-200
            ${snapshot.isDragging ? 'shadow-lg shadow-blue-500/20 border-blue-500' : ''}
            ${task.completed ? 'opacity-60' : ''}
            ${(task.priority || 0) > 0 ? `border-2 ${priorityConfig.borderClass} ${priorityConfig.bgClass}` : 'border border-dark-border'}
            touch-manipulation
          `}
        >
          <div className="flex items-start gap-2">
            {/* Priority Star - Click to cycle through levels */}
            <button
              onClick={cyclePriority}
              className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 transition-all touch-manipulation"
              title={`Priority: ${priorityConfig.label} (click to change)`}
            >
              <svg 
                className={`w-full h-full transition-colors ${
                  (task.priority || 0) > 0
                    ? `${priorityConfig.textClass} ${priorityConfig.fillClass}` 
                    : 'text-gray-600 hover:text-yellow-400'
                }`}
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>

            {/* Checkbox */}
            <button
              onClick={toggleComplete}
              className={`
                mt-0.5 flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded border-2 transition-all touch-manipulation
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

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-dark-bg border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 resize-none touch-manipulation"
                  rows={2}
                  autoFocus
                />
              ) : (
                <div>
                  <p
                    onClick={() => setIsEditing(true)}
                    className={`
                      text-sm cursor-pointer break-words
                      ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}
                      ${(task.priority || 0) > 0 && !task.completed ? 'font-medium' : ''}
                    `}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {(task.priority || 0) > 0 && !task.completed && (
                      <span className={`inline-block px-2 py-0.5 ${priorityConfig.bgClass.replace('/5', '/20')} ${priorityConfig.textClass} text-xs rounded-full`}>
                        P{task.priority} {priorityConfig.label}
                      </span>
                    )}
                    
                    {/* Time Slot Picker */}
                    {isEditingTime ? (
                      <div className="relative">
                        <select
                          value={selectedTime}
                          onChange={(e) => {
                            setSelectedTime(e.target.value);
                            handleTimeSelect(e.target.value);
                          }}
                          onBlur={() => setIsEditingTime(false)}
                          className="w-24 bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 touch-manipulation appearance-none"
                          autoFocus
                        >
                          <option value="">No time</option>
                          {generateTimeSlots().map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedTime(getTaskTime() || '');
                          setIsEditingTime(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 sm:py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full hover:bg-purple-500/20 active:bg-purple-500/30 transition-colors touch-manipulation"
                        title="Click to set start time"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {getTaskTime() || 'Time'}
                      </button>
                    )}
                    
                    {/* Estimated Hours */}
                    {isEditingHours ? (
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                        onBlur={handleHoursSave}
                        onKeyDown={handleHoursKeyDown}
                        className="w-20 sm:w-16 bg-dark-bg border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 touch-manipulation"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setIsEditingHours(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 sm:py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full hover:bg-blue-500/20 active:bg-blue-500/30 transition-colors touch-manipulation"
                        title="Click to set duration (hours)"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {(task.estimatedHours || 0) > 0 ? `${task.estimatedHours}h` : 'Duration'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Timer Button */}
            <button
              onClick={() => onStartTimer && onStartTimer(task)}
              className="flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-400 active:text-blue-500 p-1 -m-1 touch-manipulation"
              title="Start timer for this task"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(day, task.id)}
              className="flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400 active:text-red-500 p-1 -m-1 touch-manipulation"
              title="Delete task"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

