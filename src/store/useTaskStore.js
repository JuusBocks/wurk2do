import { create } from 'zustand';
import { STORAGE_KEY, DAYS_OF_WEEK } from '../config/constants';

const getInitialData = () => {
  // Always start with empty tasks - tasks only come from Google Drive sync
  const defaultData = {
    tasks: {},
    lastModified: Date.now(),
  };
  
  // Initialize empty arrays for each day
  DAYS_OF_WEEK.forEach(day => {
    defaultData.tasks[day] = [];
  });
  
  return defaultData;
};

export const useTaskStore = create((set, get) => ({
  ...getInitialData(),
  
  // Add a new task
  addTask: (day, taskText) => {
    const now = Date.now();
    const newTask = {
      id: `task_${now}_${Math.random().toString(36).substr(2, 9)}`,
      text: taskText,
      completed: false,
      priority: 0, // 0 = none, 1 = low, 2 = medium, 3 = high
      estimatedHours: 0, // Estimated hours to complete
      createdAt: now,
      lastModified: now,
    };
    
    set(state => ({
      tasks: {
        ...state.tasks,
        [day]: [...state.tasks[day], newTask],
      },
      lastModified: Date.now(),
    }));
  },
  
  // Update a task
  updateTask: (day, taskId, updates) => {
    set(state => {
      const now = Date.now();
      return {
        tasks: {
          ...state.tasks,
          [day]: state.tasks[day].map(task =>
            task.id === taskId ? { ...task, ...updates, lastModified: now } : task
          ),
        },
        lastModified: now,
      };
    });
  },
  
  // Delete a task
  deleteTask: (day, taskId) => {
    set(state => ({
      tasks: {
        ...state.tasks,
        [day]: state.tasks[day].filter(task => task.id !== taskId),
      },
      lastModified: Date.now(),
    }));
  },
  
  // Move task between days (for drag and drop)
  moveTask: (taskId, fromDay, toDay, newIndex) => {
    set(state => {
      const sourceDay = state.tasks[fromDay];
      const task = sourceDay.find(t => t.id === taskId);
      
      if (!task) return state;
      
      const now = Date.now();
      const newTasks = { ...state.tasks };
      
      // Remove from source
      newTasks[fromDay] = sourceDay.filter(t => t.id !== taskId);
      
      // Add to destination with updated lastModified
      const destTasks = [...newTasks[toDay]];
      destTasks.splice(newIndex, 0, { ...task, lastModified: now });
      newTasks[toDay] = destTasks;
      
      return {
        tasks: newTasks,
        lastModified: now,
      };
    });
  },
  
  // Reorder task within the same day
  reorderTask: (day, startIndex, endIndex) => {
    set(state => {
      const dayTasks = [...state.tasks[day]];
      const [removed] = dayTasks.splice(startIndex, 1);
      dayTasks.splice(endIndex, 0, removed);
      
      return {
        tasks: {
          ...state.tasks,
          [day]: dayTasks,
        },
        lastModified: Date.now(),
      };
    });
  },
  
  // Load data from external source (Google Drive)
  loadData: (data) => {
    set(() => ({
      tasks: data.tasks,
      lastModified: data.lastModified || Date.now(),
    }));
  },
  
  // Get all data for sync
  getAllData: () => {
    const state = get();
    return {
      tasks: state.tasks,
      lastModified: state.lastModified,
    };
  },
}));

