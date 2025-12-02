import { Task, TaskStats, TaskFilter, TaskCategory, TaskPriority } from '@/types/task';

export const STORAGE_KEY = 'task-tackler-tasks';
export const THEME_KEY = 'task-tackler-theme';

// Task Management
export const saveTasks = (tasks: Task[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};

export const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

// Theme Management
export const saveTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
  }
};

export const loadTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  }
  return 'light';
};

// Task Statistics
export const calculateStats = (tasks: Task[]): TaskStats => {
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
    byCategory: {} as Record<TaskCategory, number>,
    byPriority: {} as Record<TaskPriority, number>,
  };

  const categories: TaskCategory[] = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  categories.forEach(cat => {
    stats.byCategory[cat] = tasks.filter(t => t.category === cat).length;
  });

  priorities.forEach(pri => {
    stats.byPriority[pri] = tasks.filter(t => t.priority === pri).length;
  });

  return stats;
};

// Task Filtering and Sorting
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter(task => {
    if (filter.category && task.category !== filter.category) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.completed !== undefined && task.completed !== filter.completed) return false;
    if (filter.dueDateRange) {
      const dueDate = new Date(task.dueDate);
      const start = new Date(filter.dueDateRange.start);
      const end = new Date(filter.dueDateRange.end);
      if (dueDate < start || dueDate > end) return false;
    }
    return true;
  });
};

export const sortTasks = (
  tasks: Task[],
  sortBy: 'date' | 'priority' | 'category' | 'created',
): Task[] => {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case 'date':
      sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      break;
    case 'priority': {
      const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      sorted.sort((a, b) => (priorityOrder as any)[a.priority] - (priorityOrder as any)[b.priority]);
      break;
    }
    case 'category':
      sorted.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'created':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
  
  return sorted;
};

// Search
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery) ||
    task.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Date Utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const isOverdue = (dueDate: string, completed: boolean): boolean => {
  return !completed && new Date(dueDate) < new Date();
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
