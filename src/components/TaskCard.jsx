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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group bg-dark-surface border border-dark-border rounded-lg p-3 mb-2
            hover:border-gray-600 active:border-blue-500 transition-all duration-200
            ${snapshot.isDragging ? 'shadow-lg shadow-blue-500/20 border-blue-500' : ''}
            ${task.completed ? 'opacity-60' : ''}
            touch-manipulation
          `}
        >
          <div className="flex items-start gap-2">
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
                <p
                  onClick={() => setIsEditing(true)}
                  className={`
                    text-sm cursor-pointer break-words
                    ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}
                  `}
                >
                  {task.text}
                </p>
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

