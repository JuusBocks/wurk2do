import { useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { DayColumn } from './DayColumn';
import { DAYS_OF_WEEK } from '../config/constants';
import { useTaskStore } from '../store/useTaskStore';
import { startOfWeek, addDays, format, isToday as isTodayFn } from 'date-fns';

export const WeekView = ({ onDataChange, onTaskSelectForTimer }) => {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const moveTask = useTaskStore(state => state.moveTask);
  const reorderTask = useTaskStore(state => state.reorderTask);

  // Calculate current week dates
  const weekDates = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    return DAYS_OF_WEEK.map((_, index) => addDays(start, index));
  }, []);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;

    if (sourceDay === destDay && source.index === destination.index) {
      return;
    }

    if (sourceDay === destDay) {
      // Reorder within same day
      reorderTask(sourceDay, source.index, destination.index);
    } else {
      // Move to different day
      moveTask(draggableId, sourceDay, destDay, destination.index);
    }

    // Trigger sync after drag
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleAddTask = (day, text) => {
    addTask(day, text);
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleUpdateTask = (day, taskId, updates) => {
    updateTask(day, taskId, updates);
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleDeleteTask = (day, taskId) => {
    deleteTask(day, taskId);
    if (onDataChange) {
      onDataChange();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-3 sm:px-4 scrollbar-thin snap-x snap-mandatory">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className="snap-center">
            <DayColumn
              day={day}
              tasks={tasks[day] || []}
              date={weekDates[index]}
              isToday={isTodayFn(weekDates[index])}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

