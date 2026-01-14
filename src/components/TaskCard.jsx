import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

export const TaskCard = ({ task, index, day, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

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

  const toggleComplete = () => {
    onUpdate(day, task.id, { completed: !task.completed });
  };

  const togglePriority = () => {
    onUpdate(day, task.id, { priority: !task.priority });
  };

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
            ${task.priority ? 'border-2 border-orange-500 bg-orange-500/5' : 'border border-dark-border'}
            touch-manipulation
          `}
        >
          <div className="flex items-start gap-2">
            {/* Priority Star */}
            <button
              onClick={togglePriority}
              className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 transition-all touch-manipulation"
              title={task.priority ? "Remove priority" : "Mark as priority"}
            >
              <svg 
                className={`w-full h-full transition-colors ${
                  task.priority 
                    ? 'text-orange-500 fill-orange-500' 
                    : 'text-gray-600 hover:text-orange-400'
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
                      ${task.priority && !task.completed ? 'font-medium' : ''}
                    `}
                  >
                    {task.text}
                  </p>
                  {task.priority && !task.completed && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      Priority
                    </span>
                  )}
                </div>
              )}
            </div>

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

