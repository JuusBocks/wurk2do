import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { format } from 'date-fns';

export const DayColumn = ({ day, tasks, date, onAddTask, onUpdateTask, onDeleteTask, isToday }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(day, newTaskText.trim());
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const highPriorityCount = tasks.filter(t => (t.priority || 0) === 3 && !t.completed).length;
  const mediumPriorityCount = tasks.filter(t => (t.priority || 0) === 2 && !t.completed).length;
  const lowPriorityCount = tasks.filter(t => (t.priority || 0) === 1 && !t.completed).length;
  const totalPriorityCount = highPriorityCount + mediumPriorityCount + lowPriorityCount;
  const totalEstimatedHours = tasks
    .filter(t => !t.completed)
    .reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  return (
    <div className={`
      flex-shrink-0 w-72 sm:w-80 bg-dark-surface rounded-lg border
      ${isToday ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-dark-border'}
    `}>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-base sm:text-lg font-semibold ${isToday ? 'text-blue-400' : 'text-gray-200'}`}>
            {day}
          </h3>
          {isToday && (
            <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
              Today
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm text-gray-400">
              {format(date, 'MMM d')}
            </p>
            {totalEstimatedHours > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-blue-400" title="Estimated hours">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalEstimatedHours}h
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {highPriorityCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-red-400" title="High priority">
                <svg className="w-3 h-3 fill-red-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {highPriorityCount}
              </span>
            )}
            {mediumPriorityCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-orange-400" title="Medium priority">
                <svg className="w-3 h-3 fill-orange-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {mediumPriorityCount}
              </span>
            )}
            {lowPriorityCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-yellow-400" title="Low priority">
                <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {lowPriorityCount}
              </span>
            )}
            {totalCount > 0 && (
              <p className="text-xs text-gray-500">
                {completedCount}/{totalCount}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <Droppable droppableId={day}>
        {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                p-2 sm:p-3 min-h-[200px] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin
                ${snapshot.isDraggingOver ? 'bg-dark-hover' : ''}
              `}
            >
            {tasks
              .sort((a, b) => {
                // Sort by priority level (high to low), then by creation date
                const aPriority = a.priority || 0;
                const bPriority = b.priority || 0;
                if (aPriority !== bPriority) return bPriority - aPriority; // Higher priority first
                return 0;
              })
              .map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  day={day}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            {provided.placeholder}

            {/* Add Task Button/Form */}
            {isAdding ? (
              <div className="mt-2">
                <textarea
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task description..."
                  className="w-full bg-dark-bg border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none touch-manipulation"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-3 py-2 sm:py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm rounded transition-colors touch-manipulation"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewTaskText('');
                    }}
                    className="flex-1 px-3 py-2 sm:py-1 bg-dark-bg hover:bg-dark-hover active:bg-dark-border text-gray-400 text-sm rounded transition-colors touch-manipulation"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full mt-2 py-3 sm:py-2 border-2 border-dashed border-dark-border hover:border-gray-600 active:border-gray-500 rounded-lg text-gray-500 hover:text-gray-400 text-sm transition-all touch-manipulation"
              >
                + Add Task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

