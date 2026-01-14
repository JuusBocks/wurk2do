import { DAYS_OF_WEEK } from '../config/constants';
import { format, startOfWeek, addDays } from 'date-fns';

export const TaskSummary = ({ tasks }) => {
  const weekDates = DAYS_OF_WEEK.map((_, index) => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return addDays(start, index);
  });

  const getTotalStats = () => {
    let total = 0;
    let completed = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    DAYS_OF_WEEK.forEach(day => {
      const dayTasks = tasks[day] || [];
      total += dayTasks.length;
      completed += dayTasks.filter(t => t.completed).length;
      high += dayTasks.filter(t => (t.priority || 0) === 3 && !t.completed).length;
      medium += dayTasks.filter(t => (t.priority || 0) === 2 && !t.completed).length;
      low += dayTasks.filter(t => (t.priority || 0) === 1 && !t.completed).length;
    });

    return { total, completed, high, medium, low };
  };

  const stats = getTotalStats();

  return (
    <div className="mt-6 px-3 sm:px-6 mb-6 sm:mb-8">
      <div className="bg-dark-surface rounded-lg border border-dark-border p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-200">
            📋 Week Summary
          </h3>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-gray-400">
              {stats.completed}/{stats.total} tasks
            </span>
            {stats.high > 0 && (
              <span className="flex items-center gap-1 text-red-400" title="High priority">
                <svg className="w-3 h-3 fill-red-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {stats.high}
              </span>
            )}
            {stats.medium > 0 && (
              <span className="flex items-center gap-1 text-orange-400" title="Medium priority">
                <svg className="w-3 h-3 fill-orange-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {stats.medium}
              </span>
            )}
            {stats.low > 0 && (
              <span className="flex items-center gap-1 text-yellow-400" title="Low priority">
                <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {stats.low}
              </span>
            )}
          </div>
        </div>

        {/* Day-by-day summary */}
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day, index) => {
            const dayTasks = tasks[day] || [];
            if (dayTasks.length === 0) return null;

            const dayCompleted = dayTasks.filter(t => t.completed).length;
            const highPriority = dayTasks.filter(t => (t.priority || 0) === 3 && !t.completed).length;
            const mediumPriority = dayTasks.filter(t => (t.priority || 0) === 2 && !t.completed).length;
            const lowPriority = dayTasks.filter(t => (t.priority || 0) === 1 && !t.completed).length;
            const sortedTasks = [...dayTasks].sort((a, b) => {
              const aPriority = a.priority || 0;
              const bPriority = b.priority || 0;
              if (aPriority !== bPriority) return bPriority - aPriority;
              return 0;
            });

            return (
              <div key={day} className="border-l-2 border-gray-700 pl-3 py-1">
                {/* Day header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      {day}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(weekDates[index], 'MMM d')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {highPriority > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-red-400">
                        <svg className="w-2.5 h-2.5 fill-red-500" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        {highPriority}
                      </span>
                    )}
                    {mediumPriority > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-orange-400">
                        <svg className="w-2.5 h-2.5 fill-orange-500" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        {mediumPriority}
                      </span>
                    )}
                    {lowPriority > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                        <svg className="w-2.5 h-2.5 fill-yellow-500" viewBox="0 0 24 24">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        {lowPriority}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {dayCompleted}/{dayTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks list */}
                <ul className="space-y-1">
                  {sortedTasks.map(task => {
                    const priority = task.priority || 0;
                    const priorityColors = {
                      3: { text: 'text-red-500', fill: 'fill-red-500' },
                      2: { text: 'text-orange-500', fill: 'fill-orange-500' },
                      1: { text: 'text-yellow-500', fill: 'fill-yellow-500' }
                    };
                    const colors = priorityColors[priority];
                    
                    return (
                      <li key={task.id} className="flex items-start gap-2 text-xs sm:text-sm">
                        {/* Icons */}
                        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                          {priority > 0 && !task.completed && colors && (
                            <svg className={`w-3 h-3 ${colors.text} ${colors.fill}`} viewBox="0 0 24 24">
                              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          )}
                          {task.completed ? (
                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="w-3 h-3 border border-gray-600 rounded flex-shrink-0"></span>
                          )}
                        </div>

                        {/* Task text */}
                        <span className={`
                          ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}
                          ${priority > 0 && !task.completed ? 'font-medium' : ''}
                        `}>
                          {task.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Empty state */}
          {stats.total === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tasks yet. Start planning your week! 📅
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
